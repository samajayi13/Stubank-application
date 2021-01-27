var express = require('express');
var router = express.Router();
var db = require('../dbconnection');
const PDFDocument = require('pdfkit');
var fs = require('file-system');


// if not logged in, doesn't display e-documents page
const redirectToLogin = (req, res, next) => {
    if (!req.session.username) {
        res.redirect('/login');
    } else {
        next();
    }
}

/* GET e-documents page. */
router.get('/', redirectToLogin, function(req, res, next) {
    res.render('e-documents', { title: 'E-Documents' });
});

router.get('/getEDocs', function(req, res, next) {
    var ID = req.query.ID;
    console.log("REQUESTED ID: " + ID)
    var sql =  `
                SELECT *
                FROM Bank_Accounts
                JOIN Bank_Account_types
                    ON Bank_Account_types.Account_Type = Bank_Accounts.Account_Type_ID
                WHERE Customer_ID = ${ID}`;

    db.query(sql,function(error,results,fields){
        if (error) throw error;
        res.send({edocsData : results });
    });
});
router.get('/getStatementInfo', function(req, res, next) {
    var bankAccountID = req.query.bankAccountID;
    console.log("REQUESTED ID: " + bankAccountID)
    var sql =  `
                SELECT Amount_Transferred,Transfer_From_Bank_Account_ID,Transfer_To_Bank_Account_ID,Date_Of_Transfer,
       CASE WHEN Transfers.Transfer_From_Bank_Account_ID = ${bankAccountID}
            THEN (SELECT CONCAT(First_Name ,' ', Last_Name) AS Full_Name
                    FROM Customers
                        Join Bank_Accounts
                            ON Customers.ID = Bank_Accounts.Customer_ID
                    WHERE Bank_Accounts.ID = Transfers.Transfer_To_Bank_Account_ID
                    )
            WHEN Transfers.Transfer_To_Bank_Account_ID = ${bankAccountID}
                 THEN (SELECT CONCAT(First_Name ,' ', Last_Name) AS Full_Name
                    FROM Customers
                        Join Bank_Accounts
                            ON Customers.ID = Bank_Accounts.Customer_ID
                    WHERE Bank_Accounts.ID = Transfers.Transfer_From_Bank_Account_ID
                    )
            ELSE ''
        END as full_name,
       CASE WHEN Transfers.Transfer_From_Bank_Account_ID = ${bankAccountID}
            THEN 'OUT'
            WHEN Transfers.Transfer_To_Bank_Account_ID = ${bankAccountID}
                 THEN 'IN'
            ELSE ''
        END as in_or_out
        FROM Transfers
        JOIN Transfer_Information
            ON Transfer_Information.Transfer_Information_ID = Transfers.Transfer_Information_ID
        JOIN Bank_Accounts
            ON  Bank_Accounts.ID = Transfers.Transfer_From_Bank_Account_ID OR  Transfers.Transfer_To_Bank_Account_ID

        WHERE Transfers.Transfer_From_Bank_Account_ID = ${bankAccountID} OR Transfers.Transfer_To_Bank_Account_ID = ${bankAccountID}
        GROUP BY Transfers.ID;

`;

    // db.query(sql,function(error,results,fields){
    //     if (error) throw error;
    //     res.send({results : results });
    // });

    // create a document and pipe to a blob
    var doc = new PDFDocument();


// draw some text
    doc.fontSize(25).text('Here is some vector graphics...', 100, 80);

// some vector graphics
    doc
        .save()
        .moveTo(100, 150)
        .lineTo(100, 250)
        .lineTo(200, 250)
        .fill('#FF3300');

    doc.circle(280, 200, 50).fill('#6600FF');

// an SVG path
    doc
        .scale(0.6)
        .translate(470, 130)
        .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
        .fill('red', 'even-odd')
        .restore();

// and some justified text wrapped into columns
    doc
        .text('And here is some wrapped text...', 100, 300)
        .font('Times-Roman', 13)
        .moveDown()
        .text(lorem, {
            width: 412,
            align: 'justify',
            indent: 30,
            columns: 2,
            height: 300,
            ellipsis: true
        });

    doc.end();
    res.send(doc.toString('base64'));
    console.log(res);

    // fs.readFile(doc, function (err,data){
    //     res.contentType("application/pdf");
    //     res.send(data);
    // });
});

module.exports = router;
