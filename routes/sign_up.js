var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('sign_up');
});


// router.post('/auth',function(req,res,next){
//     console.log(req);
// })

let db = require('../dbconnection');


router.post('/create', function(req, res, next) {

    // store all the user input data
    const userDetails = req.body;
    var firstName = userDetails["first-name"];
    var lastName = userDetails["last-name"];
    var phoneNumber = userDetails["phone-number"];
    var email = userDetails["email"];
    var username = userDetails["username"];
    var password = userDetails["password"];
    var univeristy = userDetails["univeristy"];
    var studentID = userDetails["student-ID"];


    var sql = `INSERT INTO Customers (First_Name ,Last_Name ,Phone_Number ,Email ,Registration_Date ,Username, Password ,Customer_Account_Type_ID ,University_Name,Student_ID) VALUES('${firstName}','${lastName}','${phoneNumber}','${email}',NOW(),'${username}','${password}',1,'${univeristy}','${studentID}')`;
    db.query(sql);
    let valid = "true";
    res.redirect('/sign_up?valid="'+valid+'"');
    db.endConnection();
});

module.exports = router;
