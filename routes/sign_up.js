var express = require('express');
var router = express.Router();
var CryptoJS = require("crypto-js");
var key = 'sfsdfsdf44242sdfds34224dfsfsf34324gdfgdfgd3sdfsdfsdf23sfsdfsdfsdfsffg23@sdf@@!£"$%^&*&fg££$%££@@%$$%£$%"$%fd';

router.get('/', function(req, res, next) {
    encryptData("hello my name is sam");
    res.render('sign_up');
});

function encryptData(data){
    console.log(data + "working here");
    var ciphertext = CryptoJS.AES.encrypt(data, key);
    console.log(data + "working here 2");
    return ciphertext.toString()
}

function decryptData(ciphertext){
    var bytes = CryptoJS.AES.decrypt(ciphertext, key);
    var plaintext = bytes.toString(CryptoJS.enc.Utf8);
    return plaintext;
}

// router.post('/auth',function(req,res,next){
//     console.log(req);
// })

let db = require('../dbconnection');


router.post('/create', function(req, res, next) {
    console.log("in create");
    // store all the user input data
    const userDetails = req.body;
    var firstName = encryptData(userDetails["first-name"]);
    var lastName = encryptData(userDetails["last-name"]);
    var phoneNumber = encryptData(userDetails["phone-number"]);
    var email = encryptData(userDetails["email"]);
    var username = encryptData(userDetails["username"]);
    var password = encryptData(userDetails["password"]);
    var univeristy = encryptData(userDetails["univeristy"]);
    var studentID = encryptData(userDetails["student-ID"]);
    var sql = `INSERT INTO Customers (First_Name ,Last_Name ,Phone_Number ,Email ,Registration_Date ,Username, Password ,Customer_Account_Type_ID ,University_Name,Student_ID) VALUES('${firstName}','${lastName}','${phoneNumber}','${email}',NOW(),'${username}','${password}',1,'${univeristy}','${studentID}')`;
    db.query(sql);
    let valid = "true";
    res.redirect('/sign_up?valid="'+valid+'"');
});

module.exports = router;
