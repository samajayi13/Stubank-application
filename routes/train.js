var express = require('express');
var router = express.Router();
const tf = require('@tensorflow/tfjs');

router.get('/', function(req, res, next) {
    res.render('payment', { title: 'Payment' });
});

router.get('/run', function(req, res, next) {


});