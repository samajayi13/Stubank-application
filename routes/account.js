var express = require('express');
var router = express.Router();

// if not logged in, doesn't display account page
const redirectToLogin = (req, res, next) => {
    if (!req.session.username) {
        res.redirect('/login')
    } else {
        next()
    }
}

// displays account page
router.get('/', redirectToLogin, function(req, res, next) {
    res.render('account', { title: 'Account' });
});

module.exports = router;
