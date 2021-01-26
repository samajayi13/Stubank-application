var express = require('express');
var router = express.Router();

// if not logged in, doesn't display contact us page
const redirectToLogin = (req, res, next) => {
    if (!req.session.username) {
        res.redirect('/login');
    } else {
        next();
    }
}

// GET contact us page
router.get('/', redirectToLogin, function(req, res, next) {
    res.render('contact_us', { title: 'Contact_us' });
});

module.exports = router;
