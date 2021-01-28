var express = require('express');
var router = express.Router();
var db = require('../dbconnection');
var encryptObj = require('../encrpytion');

// if not logged in, doesn't display users settings page
const redirectToLogin = (req, res, next) => {
    if (!req.session.username) {
        res.redirect('/login');
    } else {
        next();
    }
}

// GET users settings page
router.get('/', redirectToLogin, function(req, res, next) {
    res.render('users_settings', { title: 'StuBank' });
});


//gets the user details and decrypt results
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
    db.query(sql,function(error,results,fields){
        if (error) throw error;
        results = encryptObj.decryptResults(results);
        res.send({userData : results });
    });
});

//updates user details
router.post('/updateChanges', function(req, res, next) {
    var userID = req.body.userID;
    var firstName = req.body.firstName
    var lastName = req.body.lastName;
    var phoneNumber  = req.body.phoneNumber;
    var email = encryptObj.encryptData(req.body.email);
    var uniName = req.body.uniName;
    var studentID = req.body.studentID;
    var cards = req.body.cards;
    var password = encryptObj.encryptData(req.body.password);
    var avatar = req.body.avatarPerson;


    var sql =  `UPDATE Customers  SET First_Name = '${firstName}',  Last_Name = '${lastName}', Phone_Number = '${phoneNumber}', Email = '${email}', Password ='${password}' , University_Name = '${uniName}', Student_ID = '${studentID}', Avatar_Person = '${avatar}' WHERE Customers.ID = ${userID}; `;
    cards.forEach(function(x){
        sql += ` Update Bank_Accounts SET Card_Color = '${x.cardColor}' WHERE Bank_Accounts.Customer_ID = ${userID} AND Account_Name = '${x.accountName}';`;
    });

    db.query(sql,function(error,results,fields){
        if (error) throw error;
        results = encryptObj.decryptResults(results);
        res.send({userData : results });
    });
});

module.exports = router;
