var express = require('express');
var router = express.Router();

/* GET payment page. */
router.get('/', function(req, res, next) {
    res.render('transfers', { title: 'Transfer' });
});

module.exports = router;
