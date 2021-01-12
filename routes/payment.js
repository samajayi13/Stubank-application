var express = require('express');
var router = express.Router();
var db =
/* GET payment page. */
router.get('/', function(req, res, next) {
    res.render('payment', { title: 'Payment' });
});


let db = require('../dbconnection');

router.post('/createPayment', function(req, res, next) {

});

module.exports = router;
