var express = require('express');
var router = express.Router();
let db = require('../dbconnection');
var encryptObj = require('../encrpytion');

//gets sign_up page
router.get('/', function(req, res, next) {
    res.render('sign_up');
});


//gets new customer row in customers table and assigns them a student account and savings pot account
router.post('/create', function(req, res, next) {
    // store all the user input data
    const userDetails = req.body;
    var firstName = userDetails["first-name"];
    var lastName = userDetails["last-name"];
    var phoneNumber = userDetails["phone-number"];
    var email = encryptObj.encryptData(userDetails["email"]);
    var username = encryptObj.encryptData(userDetails["username"]);
    var password = encryptObj.encryptData(userDetails["password"]);
    var university = userDetails["university"];
    var studentID = userDetails["student-ID"];
    var randAccountNumber = getRandomNumberInString(11111111,9999999);
    var randomAccountNumber = getRandomNumberInString(11111111,9999999);
    var randCardNumber = getRandomNumberInString(1111111111111111,999999999999999);
    var randomCardNumber = encryptObj.encryptData(getRandomNumberInString(1111111111111111,999999999999999));
    var randSecurityNumber = encryptObj.encryptData(getRandomNumberInString(111,99));
    var randomSecurityNumber = encryptObj.encryptData(getRandomNumberInString(111,99));
    var sql = `INSERT INTO Customers (First_Name ,Last_Name ,Phone_Number ,Email ,Registration_Date ,Username, Password ,Customer_Account_Type_ID ,University_Name,Student_ID) VALUES('${firstName}','${lastName}','${phoneNumber}','${email}',NOW(),'${username}','${password}',1,'${university}','${studentID}');
    SET @Customer_ID = (select ID from Customers  order by ID desc LIMIT 1);
    Insert into Bank_Accounts(account_name, date_opened, account_type_id, customer_id, current_balance, sort_code, account_number, card_number, cvv_number, expiry_date)
    values('Savings Pot',now(),4,@Customer_ID,0.00,'01-09-02','${randAccountNumber}','${randCardNumber}','${randSecurityNumber}',date_add(now(), interval 6 year));

    Insert into Bank_Accounts(account_name, date_opened, account_type_id, customer_id, current_balance, sort_code, account_number, card_number, cvv_number, expiry_date)
    values('Student Account',now(),1,@Customer_ID,100.00,'01-09-02','${randomAccountNumber}','${randomCardNumber}','${randomSecurityNumber}',date_add(now(), interval 3 year));

    INSERT INTO saving_pot_goals( Customer_ID)
    VALUES(@Customer_ID);
    `;
    db.query(sql);
    let valid = "true";
    res.redirect('/sign_up?valid="'+valid+'"');
});

/**
 * gets random number between range
 * @param min is the minimum number in range inclusive
 * @param max is the maximum number in range inclusive
 * @returns string
 */
function getRandomNumberInString(min,max){
    return (Math.floor(Math.random()  * min) + max).toString();
}
module.exports = router;
