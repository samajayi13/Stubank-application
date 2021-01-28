var express = require('express');
var router = express.Router();
let db = require('../dbconnection');
var encryptObj = require('../encrpytion');


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

//sends payment from users account to another users acccount
// encrypts data and checks if savings pot as checked if it it was then it send savings pot amount to savings pot
router.post('/createPayment', function(req, res, next) {
    const transferDescription  = req.body.transferDescription;
    const amountSent  = req.body.amountSent;
    const userID  = req.body.userID;
    const sendingToPot = req.body.sendingToPot;
    const sendingFromID = req.body.sendingFromID;
    const otherPersonID = req.body.otherPersonID;
    var potSql = "";
    if(sendingToPot){
        const savingPotAmountSent = Math.ceil(req.body.amountSent).toFixed(2) - amountSent;
            potSql = ` 
SET @SavingsPotID = (SELECT Bank_Accounts.ID
FROM Bank_Accounts
WHERE Customer_ID = ${userID} AND Account_Name = 'Savings Pot'
LIMIT 1);

INSERT INTO Transfer_Information(TRANSFER_DESCRIPTION, AMOUNT_TRANSFERRED, DATE_OF_TRANSFER) VALUES ('${transferDescription}', ${savingPotAmountSent},NOW()); 
SET @Transfer_Information_Savings_Pot_ID = (SELECT Transfer_Information_ID FROM Transfer_Information ORDER BY Transfer_Information_ID DESC LIMIT 1); 
insert into Transfers(transfer_from_bank_account_id, transfer_to_bank_account_id, transfer_information_id) values(${sendingFromID},@SavingsPotID,@Transfer_Information_Savings_Pot_ID);
Update Bank_Accounts
SET Current_Balance = Current_Balance + ${savingPotAmountSent}
WHERE Bank_Accounts.ID = @SavingsPotID;`;
    }
    var sql = `INSERT INTO Transfer_Information(TRANSFER_DESCRIPTION, AMOUNT_TRANSFERRED, DATE_OF_TRANSFER) VALUES ('${transferDescription}', ${amountSent},NOW());
     SET @Transfer_Information_ID = (SELECT Transfer_Information_ID FROM Transfer_Information ORDER BY Transfer_Information_ID DESC LIMIT 1);
      insert into Transfers(Transfer_From_Bank_Account_ID, Transfer_To_Bank_Account_ID, Transfer_Information_ID) values(${sendingFromID},${otherPersonID},@Transfer_Information_ID);
       Update Bank_Accounts
       SET Current_Balance = (Current_Balance - ${amountSent})
       WHERE Bank_Accounts.ID = ${sendingFromID};
       
       Update Bank_Accounts
       SET Current_Balance = (Current_Balance + ${amountSent})
       WHERE Bank_Accounts.ID = ${otherPersonID};
       
    ${potSql}`;
    db.query(sql,function(error,results,fields){
        if (error) throw error;
        res.send({result : true });
    });
});

//gets user's accounts and decrypts results
router.get('/getUserAccounts', function(req, res, next) {
    var userID = req.query.ID;
    var sql =  `SELECT Account_Name FROM Bank_Accounts WHERE Customer_ID = ${userID}`;

    db.query(sql,function(error,results,fields){
        if (error) throw error;
        results = encryptObj.decryptResults(results);
        res.send({userAccounts : results });
    });
});

//checks if user has the balance they need to make transcation
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

//checks if specific account has the money to make transaction
router.get('/checkBalanceForAccount', function(req, res, next) {
    var userID = req.query.ID;
    var amount  = req.query.amount;
    var accountName  = req.query.accountName;
    var sql =  `SELECT  (Overdraft_Limit + Current_Balance) as total_amount,Account_Name,ID
                FROM Bank_Accounts
                JOIN Bank_Account_types 
                    ON Bank_Accounts.Account_Type_ID = Bank_Account_types.Account_Type
                WHERE Customer_ID = ${userID} AND  (Overdraft_Limit + Current_Balance) > ${amount}`;

    db.query(sql,function(error,results,fields){
        if (error) throw error;
        results  = encryptObj.decryptResults(results);
        var valid = false;
        var ID = -1;
        results.forEach(function(x){
            if(x.Account_Name === accountName){
                valid = true;
                ID = x.ID;
            }
        });
        res.send({valid : valid,bankAccountID : ID  });
    });
});

//checks if account number is present in the database
router.get('/checkIfAccountValid', function(req, res, next) {
    var accountNumber  = req.query.accountNumber;
    var sql =  `SELECT * FROM Bank_Accounts`;

    db.query(sql,function(error,results,fields){
        if (error) throw error;
        results = encryptObj.decryptResults(results);
        var valid = false;
        var ID = -1
        results.forEach(function(x){
            if(x.Account_Number === accountNumber){
                valid = true;
                ID = x.ID;
            }
        })
        res.send({valid : valid, bankAccountID : ID });
    });
});


module.exports = router;
