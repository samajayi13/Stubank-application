var express = require('express');
var router = express.Router();
let db = require('../dbconnection');

router.get('/', function(req, res, next) {
    res.render('transfers', { title: 'Transfer' });
});

router.get('/getAccount', function(req, res, next) {
    var ID = req.query.ID;
    var sql =  `SELECT * FROM Bank_Accounts JOIN Customers ON Customers.ID = Bank_Accounts.Customer_ID WHERE Customers.ID = ${ID} OR Bank_Accounts.Customer_ID = ${ID};`;

    db.query(sql,function(error,results,fields){
        if (error) throw error;
        res.send({accountData : results});
    });
});

router.get('/getCard', function(req, res, next) {

    var sql = `SELECT Card_Number, Account_Number, Sort_Code, Account_Name, Date_Opened, Expiry_Date, Cvv_Number FROM Bank_Accounts;`;

    db.query(sql, function(error,results,fields){
        if (error) throw error;
        res.send({accountData : results});
    });
});

module.exports = router;
