var express = require('express');
var router = express.Router();
var db = require('../dbconnection');
var encryptObj = require('../encrpytion');
const fs = require('fs');

/**
 * gets random number
 * @param min is minimum number in range(inclusive)
 * @param max is maximum number in range(inclusive)
 * @returns {number}
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

/**
 * checks rows in db to ensure no one has the same account number
 * @param array is the rows in the database
 * @param number is the random account number that has been produced
 * @returns {boolean}
 */
function checkForIdenticalAccount(array, number) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].Account_Number==number) {
            return true
        }
    };
    return false;
}

/**
 * checks rows in db to ensure no one has the same card number
 * @param array is the rows in the database
 * @param number is the random account number that has been produced
 * @returns {boolean}
 */
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

//logs user out on log out and destroys the session
router.get('/logout', function(req, res, next) {
    var id = req.session.customerID.toString();
    var filePath = __dirname + '\\generatedStatements\\statement_'+id+".pdf";
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }

    req.session.destroy(function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
});

//gets all the accounts the user owns from the database and decrypts results
router.get('/getAccounts', function(req, res, next) {
    // var ID = req.session.customerID;
    var ID = req.query.ID;
    var sql =  `
                SELECT *,(Overdraft_Limit + Current_Balance) as availableBalance
                FROM Bank_Accounts
                JOIN Bank_Account_types
                    ON Bank_Account_types.Account_Type = Bank_Accounts.Account_Type_ID
                WHERE Customer_ID = ${ID}`;

    db.query(sql,function(error,results,fields){
        if (error) throw error;
        results = encryptObj.decryptResults(results);
        res.send({accountData : results });
    });
});

//gets the user avatar from the database and decrypts results
router.get('/getAvatar', function(req, res, next) {
    var ID = req.query.ID;
    var sql =  `
                SELECT Avatar_Person
                FROM Customers
                WHERE Customers.ID = ${ID}`;

    db.query(sql,function(error,results,fields){
        if (error) throw error;
        results = encryptObj.decryptResults(results);
        res.send({accountData : results });
    });
});

//creates a Student Bank Account for th when they request a new bank account
//gets random numbers for the account number,card number and ccvnumber. Encrpyts data and stores it in database
router.post('/createAccount', function (req,res,next) {
    // gets html input
    const accountDetails = req.body;

    // stores all the user input data
    var accountName = accountDetails["name"];
    var accountTypeID = 2// savings account type
    var customerID =  req.session.customerID;
    var currentBalance =  0.00;
    var sortCode =  "01-09-02";
    var accountNumber =  getRandomInt(1000000000,9999999999).toString(); // random number that isnt in DB
    var cardNumber =  encryptObj.encryptData(getRandomInt(10000000000000,99999999999999).toString());// random number that isnt in DB
    var cvvNumber =  encryptObj.encryptData(getRandomInt(100,999).toString()); // random number

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

    cardColor = cardColor;
    // checks if account number or card number is already in database
    var sql =  `
                SELECT Account_Number, Card_Number
                FROM Bank_Accounts`;

    db.query(sql,function(error,rows,fields){
        if (error) throw error;
        encryptObj.decryptResults(rows);

        var takenAcc = checkForIdenticalAccount(rows, accountNumber);
        var takenCard = checkForIdenticalCard(rows, cardNumber);

        if (takenAcc==true) {
            accountNumber= getRandomInt(1000000000,9999999999).toString();
        }

        if (takenCard==true) {
            cardNumber= encryptObj.encryptData(getRandomInt(10000000000000,99999999999999).toString());
        }
    });



    // creates new roll in table
    var sql3 = `INSERT INTO Bank_Accounts (Account_Name, Date_Opened, Account_Type_ID, Customer_ID, Current_Balance, Sort_Code, Account_Number, Card_Number, Cvv_Number, Expiry_Date, Card_Color) VALUES('${accountName}',now(),${accountTypeID},${customerID},'${currentBalance}','${sortCode}','${accountNumber}','${cardNumber}','${cvvNumber}',date_add(now(),interval  5 year),'${cardColor}')`;
    db.query(sql3);

    res.redirect('/account');
});

module.exports = router;
