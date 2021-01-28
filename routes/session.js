var express = require('express');
var router = express.Router();
var db = require('../dbconnection');
var encryptObj = require('../encrpytion');



//gets session attributes and returns it in the respond body of the api
router.get('/getSession', function(req, res, next) {
    var sql =  `
        SELECT Account_Name , Current_Balance
        FROM Bank_Accounts
        WHERE ID = ${req.session.bankAccountIndex}`;

    db.query(sql,function(error,results,fields){
        if (error) throw error;
        results = encryptObj.decryptResults(results);
        req.session.bankAccountName = results[0].Account_Name;
        req.session.bankCurrentBalance = results[0].Current_Balance;
        res.send({result:req.session});
    });
});

//updates current bankAccountID in the session attribute
router.post('/updateBankAccountIndex', function(req, res, next) {
    req.session.bankAccountIndex = req.body.bankAccountIndex;
    res.send({result:true});
});



module.exports = router;
