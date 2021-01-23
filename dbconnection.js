

const mysql = require('mysql');
// First you need to create a connection to the database
// Be sure to replace 'user' and 'password' with the correct values
const con = mysql.createConnection({
    host: 'sql2.freesqldatabase.com',
    user: 'sql2386191',
    password: 'lT8!wV2!',
    database: 'sql2386191',
    multipleStatements: true
});
con.connect((err) => {
    if(err){
        console.log(err.message);
        return;
    }
    console.log('Connection established');
});



module.exports = con;