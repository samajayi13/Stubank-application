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
router.get('/', redirectToLogin, function(req, res, next) {
    res.render('payment', { title: 'Payment' });
});

router.post('/createPayment', function(req, res, next) {
    const transferDetails = req.body;
    var purpose = transferDetails["transfer-purpose"];
    var amount = transferDetails["amount-to-send"];
    var date = new Date().toLocaleString("en-GB");
    console.log(purpose, amount, date);
    var sql = `INSERT INTO Transfer_Information (Transfer_Description, Amount_Transferred, Date_Of_Transfer) VALUES (purpose,amount,data);`;

});

module.exports = router;
