var express = require('express');
var router = express.Router();
let db = require('../dbconnection');

// if not logged in, doesn't display payment page
const redirectToLogin = (req, res, next) => {
    if (!req.session.username) {
        res.redirect('/login')
    } else {
        next()
    }
}

/* GET payment page. */
router.get('/', function(req, res, next) {
    res.render('payment', { title: 'Payment' });
});

router.post('/createPayment', function(req, res, next) {

    var sql = `INSERT INTO Transfer_Information (Transfer_Description, Amount_Transferred, Date_Of_Transfer)
                VALUES (1,1,1);`;

});

module.exports = router;
