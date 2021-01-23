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

/* GET payment page. */
router.get('/', redirectToLogin, function(req, res, next) {
    res.render('payment', { title: 'Payment' });
});

router.post('/createPayment', function(req, res, next) {
    const transferDescription  = req.body.transferDescription;
    const amountSent  = req.body.amountSent;
    const bankAccountName  = req.body.bankAccountName;
    const userID  = req.body.userID;
    const accountSendingToNumber  = req.body.accountSendingToNumber;
    var sql = `INSERT INTO Transfer_Information(TRANSFER_DESCRIPTION, AMOUNT_TRANSFERRED, DATE_OF_TRANSFER) VALUES ('${transferDescription}', ${amountSent},NOW()); SET @Transfer_Information_ID = (SELECT Transfer_Information_ID FROM Transfer_Information ORDER BY Transfer_Information_ID DESC LIMIT 1); SET @UserBankAccountID  = (SELECT Bank_Accounts.ID FROM Bank_Accounts WHERE Bank_Accounts.Account_Name = '${bankAccountName}' AND Bank_Accounts.Customer_ID = ${userID}); set @BankAccountID = (SELECT Bank_Accounts.ID FROM Bank_Accounts WHERE Account_Number = '${accountSendingToNumber}' ); insert into Transfers(transfer_from_bank_account_id, transfer_to_bank_account_id, transfer_information_id) values(@UserBankAccountID,@BankAccountID,@Transfer_Information_ID);`;
    db.query(sql,function(error,results,fields){
        if (error) throw error;
        res.send({result : true });
    });
});

router.get('/getUserAccounts', function(req, res, next) {
    var userID = req.query.ID;
    var sql =  `SELECT Account_Name FROM Bank_Accounts WHERE Customer_ID = ${userID}`;

    db.query(sql,function(error,results,fields){
        if (error) throw error;
        console.log(results);
        res.send({userAccounts : results });
    });
});

router.get('/checkBalance', function(req, res, next) {
    var userID = req.query.ID;
    var amount  = req.query.amount;
    var sql =  `SELECT  (Overdraft_Limit + Current_Balance) as total_amount
                FROM Bank_Accounts
                JOIN Bank_Account_types 
                    ON Bank_Accounts.Account_Type_ID = Bank_Account_types.Account_Type
                WHERE Customer_ID = ${userID} AND  (Overdraft_Limit + Current_Balance) > ${amount}`;

    db.query(sql,function(error,results,fields){
        if (error) throw error;
        var valid = results.length > 0 ? true : false;
        res.send({valid : valid });
    });
});
router.get('/checkBalanceForAccount', function(req, res, next) {
    var userID = req.query.ID;
    var amount  = req.query.amount;
    var accountName  = req.query.accountName;
    var sql =  `SELECT  (Overdraft_Limit + Current_Balance) as total_amount
                FROM Bank_Accounts
                JOIN Bank_Account_types 
                    ON Bank_Accounts.Account_Type_ID = Bank_Account_types.Account_Type
                WHERE Customer_ID = ${userID} AND  (Overdraft_Limit + Current_Balance) > ${amount} AND Account_Name = '${accountName}'`;

    db.query(sql,function(error,results,fields){
        if (error) throw error;
        var valid = results.length > 0 ? true : false;
        res.send({valid : valid });
    });
});

router.get('/checkIfAccountValid', function(req, res, next) {
    var accountNumber  = req.query.accountNumber;
    var sql =  `SELECT * FROM Bank_Accounts WHERE Bank_Accounts.Account_Number = '${accountNumber}'`;

    db.query(sql,function(error,results,fields){
        if (error) throw error;
        var valid = results.length > 0 ? true : false;
        res.send({valid : valid });
    });
});


module.exports = router;
