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

/* GET eDocPage page. */
router.get('/', redirectToLogin, function(req, res, next) {
    res.render('single_e_doc', { title: 'Payment' });
});


router.get('/getUserAccounts', function(req, res, next) {
    var userID = req.query.ID;
    var sql =  `SELECT Account_Name FROM Bank_Accounts WHERE Customer_ID = ${userID}`;

    db.query(sql,function(error,results,fields){
        if (error) throw error;
        console.log(results);
        res.send({userAccounts : results });
    });
});



module.exports = router;
