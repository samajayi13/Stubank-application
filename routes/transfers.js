var express = require('express');
var router = express.Router();
let db = require('../dbconnection');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('transfers', { title: 'Transfers' });
});

router.get('/getTransfers', function(req, res, next) {
    var ID = req.query.ID;
    var sql =  ` SELECT * FROM Transfers JOIN Transfer_Information ON Transfer_Information.Transfer_Information_ID = Transfers.Transfer_Information_ID WHERE Transfers.Transfer_From_ID = ${ID} OR Transfers.Transfer_To_ID = ${ID};`;
    db.query(sql,function(error,results,fields){
        if (error) throw error;
        res.send({transferData : results});
    });

});

module.exports = router;