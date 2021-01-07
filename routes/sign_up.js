var express = require('express');
var router = express.Router();

/* GET payment page. */
router.get('/', function(req, res, next) {
    res.render('sign_up', { title: 'sign up' });
});

module.exports = router;
