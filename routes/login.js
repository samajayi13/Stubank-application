var express = require('express');
var router = express.Router();
var encryptObj = require('../encrpytion');
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

// gets login page
router.get('/', redirectToAccount, function(req, res, next) {
    res.render('login');
});

// Checks if the username and password entered by the user is present in the database
// if there is a present row it add user details to a session and opens the user account page
router.post('/signin',  function(req, res, next) {
    // stores all the user input data
    const userDetails = req.body;
    var username = userDetails["username"];
    var password  = userDetails["password"];
    var sql = "SELECT *,Bank_Accounts.ID as Bank_ID,Customers.ID  as Customer_ID FROM Customers RIGHT JOIN Bank_Accounts ON Customers.ID = Bank_Accounts.Customer_ID";

    db.query(sql,function(error,results,fields){
        console.log("here");
        var valid = false;
        console.log("username: ",username);
        console.log("password: " +password);
        results.forEach(function(x){
            if((encryptObj.decryptData(x.Username) === username) && (encryptObj.decryptData(x.Password) === password)){
                // adds user information to session
                req.session.username = userDetails["username"];
                req.session.password = userDetails["password"];
                req.session.customerID = encryptObj.decryptData(x.Customer_ID);
                req.session.firstName = encryptObj.decryptData(x.First_Name);
                req.session.lastName = encryptObj.decryptData(x.Last_Name);
                req.session.phoneNumber = encryptObj.decryptData(x.Phone_Number);
                req.session.email = encryptObj.decryptData(x.Email);
                req.session.customerAccountType = encryptObj.decryptData(x.Customer_Account_Type_ID);
                req.session.universityName = encryptObj.decryptData(x.University_Name);
                req.session.studentID = encryptObj.decryptData(x.Student_ID);
                req.session.bankAccountIndex = encryptObj.decryptData(x.Bank_ID);
                console.log(req.session);
                valid = true;
            }
        });
        if(valid){
            res.redirect('/account');

        }else{
            res.redirect('/login');
        }
    });
});

//checks if email is present in the database
router.get('/checkIfEmailValid', function(req, res, next) {
    var email  = req.query.email;
    var sql =  `SELECT * FROM Customers`;
    var emailIndex  = -1;
    var password = "";
    db.query(sql,function(error,results,fields){
        if (error) throw error;
        results = encryptObj.decryptResults(results);
        results.forEach(function(x,i){
            if(x.Email === email){
                emailIndex = i ;
                password = x.Password;
            }
        });
        var valid = emailIndex != -1? true : false;
        res.send({valid : valid,password : password});
    });
});

module.exports = router;
