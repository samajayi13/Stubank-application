var express = require('express');
var router = express.Router();
let db = require('../dbconnection');

// if not logged in, doesn't display payment page
const redirectToLogin = (req, res, next) => {
    if (!req.session.username) {
        res.redirect('/login')
    } else {
        next()
    }
}

/* GET eDocPage page. */
router.get('/', redirectToLogin, function(req, res, next) {
    res.render('singleEDoc', { title: 'Payment' });
});


router.get('/getUsersTransfers', function(req, res, next) {
    var bankAccountID = req.query.bankAccountIndex;
    var sql =  `SELECT Amount_Transferred,Transfer_From_Bank_Account_ID,Transfer_To_Bank_Account_ID,Date_Of_Transfer,Account_Number,Account_Number,Sort_Code,Current_Balance,
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

        WHERE (Transfers.Transfer_From_Bank_Account_ID = ${bankAccountID} OR Transfers.Transfer_To_Bank_Account_ID = ${bankAccountID} ) AND ( YEAR(Date_Of_Transfer) =  YEAR(NOW()) AND MONTH(Date_Of_Transfer) =  MONTH(NOW()))
        GROUP BY Transfers.ID,Date_Of_Transfer
        ORDER BY Date_Of_Transfer ASC;`;

    db.query(sql,function(error,results,fields){
        if (error) throw error;
        res.send({transfers : results });
    });
});



module.exports = router;
