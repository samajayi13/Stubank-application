var express = require('express');
let session = require("express-session");
var router = express.Router();

let db = require('../dbconnection');
const mysql = require("mysql");

// const redirectToAccount = (req, res, next) => {
//     if (req.session.userID) {
//         res.redirect('/account')
//     } else {
//         next()
//     }
// }

router.get('/', function(req, res, next) {
    res.render('login');
});

router.post('/signin',  function(req, res, next) {
    // store all the user input data
    const userDetails = req.body;
    var usernameE = userDetails["username"];
    var passwordE = userDetails["password"];
    var username = "JohnSmith123";
    var password = "Password123";

    console.log(usernameE+" , "+passwordE+" , "+username+" , "+password);

    if (usernameE !== username && passwordE !== password) {
        console.log("no such account");
        res.redirect('/login');
        next();
    } else {
        console.log("account exists");
        res.redirect('/account');
        next();
    }

    var sql = mysql.format("SELECT * FROM Customers WHERE Username = ? AND Password = ?", [username,password]);
    var result = db.query(sql, function(err,rows,fields) {});
    console.log("QUERY: "+result.toString());

    // const { userID } = req.session;
    // console.log(userID);
    // res.render('login');
    //
    // const { email, password } = req.body;
    // console.log(email);
    // console.log(password);
});

// router.post('/login', redirectToAccount, (req, res) => {
//     session = req.session;
//     const { email, password } = req.body;
//     console.log(email);
//     console.log(password);
//
//     if (email && password) {
//         const user = users.find(
//             user => user.email === email && user.password === password // hash
//         )
//
//         if (user) {
//             req.session.userID = user.id;
//             return res.render('account');
//         }
//     }
//
//     res.render('login');
// });

module.exports = router;