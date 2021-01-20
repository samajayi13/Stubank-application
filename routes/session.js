var express = require('express');
var router = express.Router();
var db = require('../dbconnection');

// displays account page


router.get('/getSession', function(req, res, next) {
    var sql =  `
        SELECT Account_Name , Current_Balance
        FROM Bank_Accounts
        WHERE ID = ${req.session.bankAccountIndex}`;

    db.query(sql,function(error,results,fields){
        if (error) throw error;
        req.session.bankAccountName = results[0].Account_Name;
        req.session.bankCurrentBalance = results[0].Current_Balance;
        res.send({result:req.session});
    });
});

router.post('/updateBankAccountIndex', function(req, res, next) {
    req.session.bankAccountIndex = req.body.bankAccountIndex;
    res.send({result:true});
});



module.exports = router;
