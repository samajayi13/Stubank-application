var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('contact_us', { title: 'Contact_us' });
});

module.exports = router;