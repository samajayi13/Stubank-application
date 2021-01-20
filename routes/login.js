var express = require('express');
var router = express.Router();

let db = require('../dbconnection');
const mysql = require("mysql");

// if already logged in, doesn't display login page
const redirectToAccount = (req, res, next) => {
    if (req.session.username) {
        console.log("SESSION USERNAME: "+req.session.username);
        res.redirect('/account')
    } else {
        next()
    }
}

router.get('/', redirectToAccount, function(req, res, next) {
    res.render('login');
});

router.post('/signin',  function(req, res, next) {
    // stores all the user input data
    const userDetails = req.body;
    var username = userDetails["username"];
    var password  = userDetails["password"];

    // searches for user in database
    var sql = mysql.format("SELECT *,Bank_Accounts.ID as Bank_ID,Customers.ID  as Customer_ID FROM Customers RIGHT JOIN Bank_Accounts ON Customers.ID = Bank_Accounts.Customer_ID WHERE Username = ? AND Password = ?", [username,password]);
     db.query(sql, function(err,rows,fields) {
         console.log(rows.length);
         console.log(rows);
         if (rows.length === 0) {
             res.redirect('/login');
         } else {
             // adds user information to session
             req.session.username = username;
             req.session.password = password;
             req.session.customerID = rows[0].Customer_ID;
             req.session.firstName = rows[0].First_Name;
             req.session.lastName = rows[0].Last_Name;
             req.session.phoneNumber = rows[0].Phone_Number;
             req.session.email = rows[0].Email;
             req.session.customerAccountType = rows[0].Customer_Account_Type_ID;
             req.session.universityName = rows[0].University_Name;
             req.session.studentID = rows[0].Student_ID;
             req.session.bankAccountIndex = rows[0].Bank_ID;
             res.redirect('/account');
         }
     });
});

module.exports = router;
