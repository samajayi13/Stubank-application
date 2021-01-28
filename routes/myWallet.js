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

/* GET myWallet page. */
router.get('/', redirectToLogin, function(req, res, next) {
    res.render('myWallet', { title: 'Payment' });
});

// gets how much money the user spent today and decrypts the results
router.get('/getTotalSpentToday', function(req, res, next) {
    var userID = req.query.userID;
    console.log(userID);
    var sql =  `
                SELECT SUM(Amount_Transferred) as SUM
                FROM Transfer_Information
                    JOIN Transfers
                        ON Transfer_Information.Transfer_Information_ID = Transfers.Transfer_Information_ID
                    JOIN Bank_Accounts
                        on  Bank_Accounts .ID = Transfers.Transfer_From_Bank_Account_ID
                    JOIN Customers
                        on Customers.ID = Bank_Accounts.Customer_ID
                WHERE (Date_Of_Transfer BETWEEN CONCAT(CURDATE(), ' 00:00:00') AND CONCAT(CURDATE(), ' 23:59:59')) AND Customer_ID = ${userID}
                GROUP BY Customers.ID;
              `;

    db.query(sql,function(error,results,fields){
        if (error) throw error;
        results = encryptObj.decryptResults(results);
        console.log(results);
        res.send({results : results });
    });
});

//gets spending per day and decrypts the results
router.get('/getSpendingPerDay', function(req, res, next) {
    var userID = req.query.userID;
    console.log(userID);
    var sql =  `
                SELECT SUM(Amount_Transferred) as Sum,DAYNAME(Date_Of_Transfer) AS Day
                FROM Transfer_Information
                    JOIN Transfers
                        ON Transfer_Information.Transfer_Information_ID = Transfers.Transfer_Information_ID
                    JOIN Bank_Accounts
                        on  Bank_Accounts .ID = Transfers.Transfer_From_Bank_Account_ID
                    JOIN Customers
                        on Customers.ID = Bank_Accounts.Customer_ID
                WHERE Customer_ID = ${userID} and YEARWEEK(Date_Of_Transfer) =  YEARWEEK(NOW())
                GROUP BY Customers.ID,DAYNAME(Date_Of_Transfer)
              `;

    db.query(sql,function(error,results,fields){
        if (error) throw error;
        results = encryptObj.decryptResults(results);
        console.log(results);
        res.send({results : results });
    });
});

//gets spending per category and decrypts the results
router.get('/getSpendingPerCategory', function(req, res, next) {
    var userID = req.query.userID;
    var sql =  `
                SELECT SUM(Amount_Transferred) as Sum,Transfer_Description as Category
                FROM Transfer_Information
                    JOIN Transfers
                        ON Transfer_Information.Transfer_Information_ID = Transfers.Transfer_Information_ID
                    JOIN Bank_Accounts
                        on  Bank_Accounts .ID = Transfers.Transfer_From_Bank_Account_ID
                    JOIN Customers
                        on Customers.ID = Bank_Accounts.Customer_ID
                WHERE Customer_ID = ${userID} and YEARWEEK(Date_Of_Transfer) =  YEARWEEK(NOW())
                GROUP BY Customers.ID,Category;

              `;
    db.query(sql,function(error,results,fields){
        if (error) throw error;
        results = encryptObj.decryptResults(results);
        console.log(results);
        res.send({results : results });
    });
});

//gets income per account and decrypts the results
router.get('/getIncomePerAccount', function(req, res, next) {
    var userID = req.query.userID;
    var sql =  `
                SELECT SUM(Amount_Transferred) as Sum,Bank_Accounts.Account_Name as Account_Name
                FROM Transfer_Information
                    JOIN Transfers
                        ON Transfer_Information.Transfer_Information_ID = Transfers.Transfer_Information_ID
                    JOIN Bank_Accounts
                        on  Bank_Accounts .ID = Transfers.Transfer_To_Bank_Account_ID
                    JOIN Customers
                        on Customers.ID = Bank_Accounts.Customer_ID
                WHERE Customer_ID =  ${userID} AND YEAR(Date_Of_Transfer) =  YEAR(NOW())
                GROUP BY Customers.ID,Account_Name;
              `;
    db.query(sql,function(error,results,fields){
        if (error) throw error; results = encryptObj.decryptResults(results); 
        results = encryptObj.decryptResults(results);
        console.log(results);
        res.send({results : results });
    });
});

module.exports = router;
