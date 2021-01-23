var express = require('express');
var router = express.Router();
var db = require('../dbconnection');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('users_settings', { title: 'StuBank' });
});

router.get('/getUserDetails', function(req, res, next) {
    var customerID = req.query.customerID;

    var sql =  `
                SELECT *
                FROM Customers
                    JOIN Bank_Accounts
                        ON Customers.ID = Bank_Accounts.Customer_ID
                    JOIN Customer_Account_Types
                        ON Customers.Customer_Account_Type_ID = Customer_Account_Types.Account_Type
                WHERE Bank_Accounts.Customer_ID = ${customerID};
               `;
    console
    db.query(sql,function(error,results,fields){
        if (error) throw error;
        res.send({userData : results });
    });
});
router.post('/updateChanges', function(req, res, next) {
    console.log("here");
    var userID = req.body.userID;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var phoneNumber  = req.body.phoneNumber;
    var email = req.body.email;
    var uniName = req.body.uniName;
    var studentID = req.body.studentID;
    var cards = req.body.cards;
    var password = req.body.password;
    var avatar = req.body.avatarPerson;

    console.log("here 2");

    var sql =  `UPDATE Customers  SET First_Name = '${firstName}',  Last_Name = '${lastName}', Phone_Number = '${phoneNumber}', Email = '${email}', Password ='${password}' , University_Name = '${uniName}', Student_ID = '${studentID}', Avatar_Person = '${avatar}' WHERE Customers.ID = ${userID}; `;
    cards.forEach(function(x){
        sql += ` Update Bank_Accounts SET Card_Color = '${x.cardColor}' WHERE Bank_Accounts.Customer_ID = ${userID} AND Account_Name = '${x.accountName}';`;
    });
    console.log("here 3");
    console.log(sql);

    db.query(sql,function(error,results,fields){
        console.log("here 4");
        if (error) throw error;
        console.log("here 5");
        console.log("success");
        res.send({userData : results });
    });
});

module.exports = router;
