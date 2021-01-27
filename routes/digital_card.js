var express = require('express');
var router = express.Router();
let db = require('../dbconnection');

// if not logged in, doesn't display transfers page
const redirectToLogin = (req, res, next) => {
    if (!req.session.username) {
        res.redirect('/login');
    } else {
        next();
    }
}

router.get('/', redirectToLogin, function(req, res, next) {
    res.render('transfers', { title: 'Transfer' });
});

router.get('/getAccount', function(req, res, next) {
    var ID = req.query.ID;
    var sql =  `SELECT *,Bank_Accounts.ID FROM Bank_Accounts JOIN Customers ON Customers.ID = Bank_Accounts.Customer_ID WHERE Customers.ID = ${ID} OR Bank_Accounts.Customer_ID = ${ID};`;

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
