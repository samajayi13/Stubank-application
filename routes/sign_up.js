var express = require('express');
var router = express.Router();
var CryptoJS = require("crypto-js");
var key = 'sfsdfsdf44242sdfds34224dfsfsf34324gdfgdfgd3sdfsdfsdf23sfsdfsdfsdfsffg23@sdf@@!£"$%^&*&fg££$%££@@%$$%£$%"$%fd';
// const bcrypt = require( 'bcrypt' );
//
// bcrypt.hash( "password", 10, function( err, hash ) {
// });
//
// bcrypt.compare( "passwordEntered", hash, function( err, res ) {
//     if( res ) {
//         //working
//     } else {
//         // Password didn't match
//     }
// });
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
    var firstName =userDetails["first-name"];
    var lastName = userDetails["last-name"];
    var phoneNumber = userDetails["phone-number"];
    var email = userDetails["email"];
    var username = userDetails["username"];
    var password = userDetails["password"];
    var university = userDetails["university"];
    var studentID = userDetails["student-ID"];
    var randAccountNumber = getRandomNumberInString(11111111,9999999);
    var randomAccountNumber = getRandomNumberInString(11111111,9999999);
    var randCardNumber = getRandomNumberInString(1111111111111111,999999999999999);
    var randomCardNumber = getRandomNumberInString(1111111111111111,999999999999999);
    var randSecurityNumber = getRandomNumberInString(111,99);
    var randomSecurityNumber = getRandomNumberInString(111,99);
    var sql = `INSERT INTO Customers (First_Name ,Last_Name ,Phone_Number ,Email ,Registration_Date ,Username, Password ,Customer_Account_Type_ID ,University_Name,Student_ID) VALUES('${firstName}','${lastName}','${phoneNumber}','${email}',NOW(),'${username}','${password}',1,'${university}','${studentID}');
    SET @Customer_ID = (select ID from Customers  order by ID desc LIMIT 1);
    Insert into Bank_Accounts(account_name, date_opened, account_type_id, customer_id, current_balance, sort_code, account_number, card_number, cvv_number, expiry_date)
    values('Savings Pot',now(),4,@Customer_ID,0.00,'01-09-02','${randAccountNumber}',${randCardNumber},'${randSecurityNumber}',date_add(now(), interval 6 year));

    Insert into Bank_Accounts(account_name, date_opened, account_type_id, customer_id, current_balance, sort_code, account_number, card_number, cvv_number, expiry_date)
    values('Student Account',now(),1,@Customer_ID,100.00,'01-09-02','${randomAccountNumber}',${randomCardNumber},'${randomSecurityNumber}',date_add(now(), interval 3 year));

    INSERT INTO saving_pot_goals( Customer_ID)
    VALUES(@Customer_ID);
    `;
    db.query(sql);
    let valid = "true";
    res.redirect('/sign_up?valid="'+valid+'"');
});

function getRandomNumberInString(min,max){
    return (Math.floor(Math.random()  * min) + max).toString();
}
module.exports = router;
