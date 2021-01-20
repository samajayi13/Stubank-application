var express = require('express');
var router = express.Router();
var db = require('../dbconnection');

// displays account page


router.get('/getSession', function(req, res, next) {
    if(!req.session.bankAccountIndex){
        makeDefaultIndex(req);
    }
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

function makeDefaultIndex(req){
    console.log("here");
    var sql =  `
    SELECT ID
    FROM Bank_Accounts
    WHERE Customer_ID =  ${req.session.customerID}`;
    db.query(sql,function(error,results,fields){
        // req.session.bankAccountIndex = results[0].ID;
        req.session.bankAccountIndex = 101;
        console.log("id = "+ req.session.bankAccountIndex);
    });
    console.log(req.session);
}

module.exports = router;
