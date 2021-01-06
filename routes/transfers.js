var express = require('express');
var router = express.Router();

/* GET transfers page. */
router.get('/', function(req, res, next) {
    res.render('transfers', { title: 'Transfers' });
});

module.exports = router;