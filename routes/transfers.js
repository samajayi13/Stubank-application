var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('transfers', { title: 'Transfers' });
});

let db = require('../dbconnection');

//db.query("SELECT Transfer_type, ID, Amount_sent, Date_Of_Transfer FROM Transfers_Information JOIN Transfers ON Transfer_From_ID OR Transfer_To_ID = userID )

db.endConnection();

module.exports = router;
