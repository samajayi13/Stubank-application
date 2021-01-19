var express = require('express');
var router = express.Router();
var db = require('../dbconnection');

// displays account page
router.get('/getSession', function(req, res, next) {
    res.send({result:req.session});
});

router.post('/updateBankAccountIndex', function(req, res, next) {
    req.session.bankAccountIndex = req.body.bankAccountIndex;
    res.send({result:true});
});

module.exports = router;
