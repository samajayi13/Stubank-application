var express = require('express');
var router = express.Router();
let db = require('../dbconnection');

/* GET payment page. */
router.get('/', function(req, res, next) {
    res.render('payment', { title: 'Payment' });
});



router.post('/createPayment', function(req, res, next) {

});

module.exports = router;
