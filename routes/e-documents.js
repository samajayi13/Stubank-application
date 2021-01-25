var express = require('express');
var router = express.Router();
var db = require('../dbconnection');

// if not logged in, doesn't display e-documents page
const redirectToLogin = (req, res, next) => {
    if (!req.session.username) {
        res.redirect('/login');
    } else {
        next();
    }
}

router.get('/download', function (req,res, next) {
    var filepath = "routes/generatedStatements/SALVA.pdf";
    console.log("Test");
    res.download('generatedStatements/SALVA.pdf');
});

/* GET e-documents page. */
router.get('/', redirectToLogin, function(req, res, next) {
    res.render('e-documents', { title: 'E-Documents' });
});

router.get('/getEDocs', function(req, res, next) {
    var ID = req.query.ID;
    console.log("REQUESTED ID: " + ID)
    var sql =  `
                SELECT *
                FROM Bank_Accounts
                JOIN Bank_Account_types
                    ON Bank_Account_types.Account_Type = Bank_Accounts.Account_Type_ID
                WHERE Customer_ID = ${ID}`;

    db.query(sql,function(error,results,fields){
        if (error) throw error;
        res.send({edocsData : results });
    });
});
router.get('/getStatementInfo', function(req, res, next) {
    var bankAccountID = req.query.bankAccountID;
    console.log("REQUESTED ID: " + bankAccountID)
    var sql =  `
                SELECT Amount_Transferred,Transfer_From_Bank_Account_ID,Transfer_To_Bank_Account_ID,Date_Of_Transfer,
       CASE WHEN Transfers.Transfer_From_Bank_Account_ID = ${bankAccountID}
            THEN (SELECT CONCAT(First_Name ,' ', Last_Name) AS Full_Name
                    FROM Customers
                        Join Bank_Accounts
                            ON Customers.ID = Bank_Accounts.Customer_ID
                    WHERE Bank_Accounts.ID = Transfers.Transfer_To_Bank_Account_ID
                    )
            WHEN Transfers.Transfer_To_Bank_Account_ID = ${bankAccountID}
                 THEN (SELECT CONCAT(First_Name ,' ', Last_Name) AS Full_Name
                    FROM Customers
                        Join Bank_Accounts
                            ON Customers.ID = Bank_Accounts.Customer_ID
                    WHERE Bank_Accounts.ID = Transfers.Transfer_From_Bank_Account_ID
                    )
            ELSE ''
        END as full_name,
       CASE WHEN Transfers.Transfer_From_Bank_Account_ID = ${bankAccountID}
            THEN 'OUT'
            WHEN Transfers.Transfer_To_Bank_Account_ID = ${bankAccountID}
                 THEN 'IN'
            ELSE ''
        END as in_or_out
        FROM Transfers
        JOIN Transfer_Information
            ON Transfer_Information.Transfer_Information_ID = Transfers.Transfer_Information_ID
        JOIN Bank_Accounts
            ON  Bank_Accounts.ID = Transfers.Transfer_From_Bank_Account_ID OR  Transfers.Transfer_To_Bank_Account_ID

        WHERE Transfers.Transfer_From_Bank_Account_ID = ${bankAccountID} OR Transfers.Transfer_To_Bank_Account_ID = ${bankAccountID}
        GROUP BY Transfers.ID;

`;

    db.query(sql,function(error,results,fields){
        if (error) throw error;
        res.send({results : results });
    });
});

module.exports = router;
