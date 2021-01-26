var express = require('express');
var router = express.Router();
var db = require('../dbconnection');
var CryptoJS = require("crypto-js");
var key = 'sfsdfsdf44242sdfds34224dfsfsf34324gdfgdfgd3sdfsdfsdf23sfsdfsdfsdfsffg23@sdf@@!£"$%^&*&fg££$%££@@%$$%£$%"$%fd';
const fs = require('fs');

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

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function checkForIdenticalAccount(array, number) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].Account_Number==number) {
            return true
        }
    };
    return false;
}

function checkForIdenticalCard(array, number) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].Card_Number==number) {
            return true
        }
    };
    return false;
}

// if not logged in, doesn't display account page
const redirectToLogin = (req, res, next) => {
    if (!req.session.username) {
        res.redirect('/login');
    } else {
        next();
    }
}

// displays account page
router.get('/', redirectToLogin, function(req, res, next) {
    res.render('account', { session: req.session, title: 'Account' });
});

router.get('/logout', function(req, res, next) {
    var id = req.session.customerID.toString();
    var filePath = __dirname + '\\generatedStatements\\statement_'+id+".pdf";
    fs.unlinkSync(filePath);
    req.session.destroy(function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
});

router.get('/getAccounts', function(req, res, next) {
    // var ID = req.session.customerID;
    var ID = req.query.ID;
    console.log("REQUESTED ID: " + ID)
    var sql =  `
                SELECT *,(Overdraft_Limit + Current_Balance) as availableBalance
                FROM Bank_Accounts
                JOIN Bank_Account_types
                    ON Bank_Account_types.Account_Type = Bank_Accounts.Account_Type_ID
                WHERE Customer_ID = ${ID}`;

    db.query(sql,function(error,results,fields){
        if (error) throw error;
        res.send({accountData : results });
    });
});
router.get('/getAvatar', function(req, res, next) {
    var ID = req.query.ID;
    console.log("REQUESTED ID: " + ID)
    var sql =  `
                SELECT Avatar_Person
                FROM Customers
                WHERE Customers.ID = ${ID}`;

    db.query(sql,function(error,results,fields){
        if (error) throw error;
        res.send({accountData : results });
    });
});

router.post('/createAccount', function (req,res,next) {
    // gets html input
    const accountDetails = req.body;

    // stores all the user input data
    // TODO: encrypt this!
    var accountName = accountDetails["name"];
    var dateOpened;
    var accountTypeID = 2; // savings account type
    var customerID = req.session.customerID;
    var currentBalance = 0.00;
    var sortCode = "01-09-02";
    var accountNumber = getRandomInt(1000000000,9999999999); // random number that isnt in DB
    var cardNumber = getRandomInt(10000000000000,99999999999999); // random number that isnt in DB
    var cvvNumber = getRandomInt(100,999); // random number
    var expiryDate;

    switch (accountDetails["colors"]) {
        case "blue":
            var cardColor = "#0080ff";
            break;
        case "red":
            var cardColor = "#e50000";
            break;
        case "green":
            var cardColor = "#00e600";
            break;
        case "pink":
            var cardColor = "#ffc0cb";
            break;
    }

    // checks if account number or card number is already in database
    var sql =  `
                SELECT Account_Number, Card_Number
                FROM Bank_Accounts`;

    db.query(sql,function(error,rows,fields){
        if (error) throw error;
        console.log(rows.length);
        console.log(rows);

        var takenAcc = checkForIdenticalAccount(rows, accountNumber);
        var takenCard = checkForIdenticalCard(rows, cardNumber);

        if (takenAcc==true) {
            accountNumber=getRandomInt(1000000000,9999999999);
        }

        if (takenCard==true) {
            cardNumber=getRandomInt(10000000000000,99999999999999);
        }
    });

    console.log("REQUESTED ID: " + customerID)

    // gets the user's accounts so we can get the same variables like account date of opening, date of expiry and sort code
    var sql2 =  `
                SELECT *
                FROM Bank_Accounts
                WHERE Customer_ID = ${customerID}`;

    db.query(sql2,function(error,rows,fields){
        if (error) throw error;
        console.log(rows.length);
        console.log(rows);
        dateOpened = rows[0].Date_Opened;
        sortCode = toString(rows[0].Sort_Code);
        expiryDate = rows[0].Expiry_Date;
    });

    // creates new roll in table
    var sql3 = `INSERT INTO Bank_Accounts (Account_Name, Date_Opened, Account_Type_ID, Customer_ID, Current_Balance, Sort_Code, Account_Number, Card_Number, Cvv_Number, Expiry_Date, Card_Color) VALUES('${accountName}',now(),'${accountTypeID}','${customerID}','${currentBalance}','${sortCode}','${accountNumber}','${cardNumber}','${cvvNumber}',date_add(now(),interval  5 year),'${cardColor}')`;
    db.query(sql3);

    res.redirect('/account');
});

module.exports = router;
