var express = require('express');
var router = express.Router();
var db = require('../dbconnection');

// if not logged in, doesn't display transfers page
const redirectToLogin = (req, res, next) => {
    if (!req.session.username) {
        res.redirect('/login');
    } else {
        next();
    }
}

/* GET transfers page. */
router.get('/', redirectToLogin, function(req, res, next) {
    res.render('transfers', { title: 'Transfer',session:req.session });
});

router.get('/getTransfers', function(req, res, next) {
    var bankAccountID = req.query.bankAccountID;

    var sql =  `
        SELECT Amount_Transferred,Transfer_From_Bank_Account_ID,Transfer_To_Bank_Account_ID,Date_Of_Transfer
        FROM Transfers 
        JOIN Transfer_Information 
            ON Transfer_Information.Transfer_Information_ID = Transfers.Transfer_Information_ID
        JOIN Bank_Accounts
            ON  Bank_Accounts.ID = Transfers.Transfer_From_Bank_Account_ID OR  Transfers.Transfer_To_Bank_Account_ID
        WHERE Transfers.Transfer_From_Bank_Account_ID = ${bankAccountID} OR Transfers.Transfer_To_Bank_Account_ID = ${bankAccountID}
        GROUP BY Transfers.ID`;


    db.query(sql,function(error,results,fields){
        if (error) throw error;
        res.send({transferData : results });
    });

});

router.get('/getUserFirstName', function(req, res, next) {
    var bankAccountID = req.query.bankAccountID;
    var sql =  `
        SELECT First_Name
        FROM Customers
        JOIN Bank_Accounts
            ON Customers.ID = Bank_Accounts.Customer_ID
        WHERE Bank_Accounts.ID = ${bankAccountID}`;

    db.query(sql,function(error,results,fields){
        if (error) throw error;
        res.send({transferData : results });
    });

});

module.exports = router;
