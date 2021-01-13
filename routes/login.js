var express = require('express');
var router = express.Router();

let db = require('../dbconnection');
const mysql = require("mysql");

// if already logged in, it won't display login page
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
    // store all the user input data
    const userDetails = req.body;
    var username = userDetails["username"];
    var password  = userDetails["password"];

    // search for user in database
    var sql = mysql.format("SELECT * FROM Customers WHERE Username = ? AND Password = ?", [username,password]);
     db.query(sql, function(err,rows,fields) {
         console.log(rows.length);
         console.log(rows);
         if (rows.length === 0) {
             res.redirect('/login');
         } else {
             // adds username and password to session
             req.session.username = username;
             req.session.password = password;

             console.log("SESSION : "+req.session.username+" " + req.session.password);

             res.redirect('/account');
         }
     });
});

module.exports = router;
