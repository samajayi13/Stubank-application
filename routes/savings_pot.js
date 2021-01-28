var express = require('express');
var router = express.Router();
var db = require('../dbconnection');
var encryptObj = require('../encrpytion');

/* GET savings pot page. */
router.get('/', function(req, res, next) {
    res.render('savingspot', { title: 'Salva' });
});

//checks current amount in savings pot and decrypts results
router.get('/getCurrentAmountInPot', function(req, res, next) {
    var sql =  `SELECT Current_Balance
                FROM Bank_Accounts
                WHERE Account_Name = 'Savings Pot' AND Customer_ID = ${req.query.userID}
                LIMIT 1;`

    db.query(sql,function(error,results,fields){
        if (error) throw error;
        results = encryptObj.decryptResults(results);
        res.send({result:results});
    });
});

//gets savings goals values from database and decrpyts data
router.get('/getSavingsGoalsValues', function(req, res, next) {
    var sql =  `SELECT *
                FROM saving_pot_goals
                where Customer_ID = ${req.query.userID}`;

    db.query(sql,function(error,results,fields){
        if (error) throw error;
        results = encryptObj.decryptResults(results);
        res.send({result:results});
    });
});


//updates savings goals values based on input fields passed through the api
router.post('/updateSavingsGoalsValues', function(req, res, next) {
    let goals  = req.body.goals;
    var i = 0;
    var insertValues = "SET ";
    Object.keys(goals).forEach(function(x){
        if(!x.includes("Customer_ID") && !x.includes("ID")){
            if(i === Object.values(goals).length-2){
                insertValues += `${x} = ${Object.values(goals)[i]} `;
            }else{
                insertValues += `${x} = ${Object.values(goals)[i]}, `;
            }
        }
        i++;
    });
    var sql =  `UPDATE saving_pot_goals
                ${insertValues}
                WHERE Customer_ID = ${ req.body.userID}`;

    db.query(sql,function(error,results,fields){
        if (error) throw error;
        res.send({result:true});
    });
});

//gets money sent to the users savings pot in the the current year
router.get('/getActualSavings', function(req, res, next) {
    var sql =  `
SET @SavingsPotID = (SELECT Bank_Accounts.ID
FROM Bank_Accounts
WHERE Customer_ID = ${req.query.userID} AND Account_Name = 'Savings Pot'
LIMIT 1);

SELECT DISTINCT (sum(Transfer_Information.Amount_Transferred)) AS SUM ,Date_Of_Transfer
        FROM Transfers
        JOIN Transfer_Information
            ON Transfer_Information.Transfer_Information_ID = Transfers.Transfer_Information_ID
        JOIN Bank_Accounts
            ON  Bank_Accounts.ID =  Transfers.Transfer_To_Bank_Account_ID
        WHERE Transfers.Transfer_To_Bank_Account_ID = @SavingsPotID
GROUP BY  DATE_FORMAT(Transfer_Information.Date_Of_Transfer, '%Y-%m-01')
HAVING  EXTRACT(YEAR FROM Date_Of_Transfer) = YEAR(curdate())
`;
    db.query(sql,function(error,results,fields){
        if (error) throw error;
        results = encryptObj.decryptResults(results);
        res.send({result:results});
    });
});


//gets income to savings pot based on savings;
router.get('/getSavingCategory', function(req, res, next) {
    var sql =  `
SET @SavingsPotID = (SELECT Bank_Accounts.ID
FROM Bank_Accounts
WHERE Customer_ID = ${req.query.userID} AND Account_Name = 'Savings Pot'
LIMIT 1);

SELECT Transfer_Description, sum(Amount_Transferred) as total
        FROM Transfers
        JOIN Transfer_Information
            ON Transfer_Information.Transfer_Information_ID = Transfers.Transfer_Information_ID
        JOIN Bank_Accounts
            ON  Bank_Accounts.ID =  Transfers.Transfer_To_Bank_Account_ID
        WHERE Transfers.Transfer_To_Bank_Account_ID = @SavingsPotID
GROUP BY  Transfer_Information.Transfer_Description
`;
    db.query(sql,function(error,results,fields){
        if (error) throw error;
        results = encryptObj.decryptResults(results);
        res.send({result:results});
    });
});

module.exports = router;

