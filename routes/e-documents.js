var express = require('express');
var router = express.Router();
var db = require('../dbconnection');

// if not logged in, doesn't display e-documents page
const redirectToLogin = (req, res, next) => {
    if (!req.session.username) {
        res.redirect('/login');
    } else {
        next();
    }
}

/* GET e-documents page. */
router.get('/', redirectToLogin, function(req, res, next) {
    res.render('e-documents', { title: 'E-Documents' });
});

router.get('/getEDocs', function(req, res, next) {
    // var ID = req.session.customerID; // TODO: use session ID instead
    var ID = req.query.ID;
    console.log("REQUESTED ID: " + ID)
    var sql =  `
                SELECT *
                FROM Bank_Accounts
                JOIN Bank_Account_types
                    ON Bank_Account_types.Account_Type = Bank_Accounts.Account_Type_ID
                WHERE Customer_ID = ${ID}`;

    db.query(sql,function(error,results,fields){
        if (error) throw error;
        res.send({edocsData : results });
    });
});

module.exports = router;
