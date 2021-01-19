var express = require('express');
var router = express.Router();
var db = require('../dbconnection');

// if not logged in, doesn't display account page
const redirectToLogin = (req, res, next) => {
    if (!req.session.username) {
        res.redirect('/login');
    } else {
        next();
    }
}

// displays account page
router.get('/', redirectToLogin, function(req, res, next) {
    res.render('account', { session: req.session, title: 'Account' });
});

router.get('/logout', function(req, res, next) {
    req.session.destroy(function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
});

router.get('/getAccounts', function(req, res, next) {
    // var ID = req.session.customerID;
    var ID = req.query.ID;
    console.log("REQUESTED ID: " + ID)
    var sql =  `SELECT * FROM Bank_Accounts WHERE Customer_ID = ${ID};`;

    db.query(sql,function(error,results,fields){
        if (error) throw error;
        console.log("test1");
        res.send({accountData : results });
    });
});

module.exports = router;
