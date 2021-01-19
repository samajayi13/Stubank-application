var express = require('express');
var router = express.Router();
var db = require('../dbconnection');

// displays account page
router.get('/getSession', function(req, res, next) {
    res.send({result:req.session});
});

module.exports = router;
