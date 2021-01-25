var express = require('express');
var router = express.Router();
var db = require('../dbconnection');
const PDFDocument = require('pdfkit');
var fs = require('fs');


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

function getAvailableAmount(doc, id) {
    var sql2 = `
                SELECT SUM(Current_Balance) AS sum
                FROM Bank_Accounts 
                WHERE Customer_ID = ${id};
        `;

    db.query(sql2,function(error,results,fields) {
        if (error) throw error;
        var sum = results[0].sum.toFixed(2).toString() + "£";
        // footer
        doc.moveDown(2)
            .fontSize(10)
            .text("Current account balance: ", { align: "right", width: 100 })
            .text(sum, { align: "right", width: 100 })
    });
};

router.get('/getStatementInfo', function(req, res, next) {
    var bankAccountID = req.query.bankAccountID;
    var customerID = req.session.customerID;
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

    db.query(sql,function(error,results,fields){
        if (error) throw error;

        var customerName = req.session.firstName.toString() + " " + req.session.lastName.toString();
        var customerNumber = req.session.customerID.toString();

        var university = req.session.universityName.toString();
        console.log(university);
        var path = "routes/generatedStatements/statement_"+req.session.customerID.toString()+".pdf"
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = dd + '/' + mm + '/' + yyyy;

        // creates a document and pipe to path
        var doc = new PDFDocument();
        doc.pipe(fs.createWriteStream(path));

        // header
        doc
            .image("public/images/logo.png", 50, 45, { width: 50 })
            .fillColor("#444444")
            .fontSize(30)
            .font('Helvetica-Bold')
            .text("SALVA Ltd.", 110, 57)
            .fontSize(14)
            .text("123 USB Road", 200, 65, { align: "right" })
            .text("Newcastle upon Tyne, NE1 23A", 200, 80, { align: "right" })
            .moveDown(2);

        doc.moveTo(20,120)
            .lineTo(600,120)
            .stroke()
            .moveDown();

        // statement details
        doc
            .fontSize(16)
            .text("BANK STATEMENT", {align: "center"},140,0)
            .text("(All transfers to "+today+")", {align: "center"},160,0)
            .moveDown()
            .text("Customer Name: "+customerName, 50, 200)
            .text("Customer Number: "+customerNumber, 50, 215)
            .text("University: "+university, 50, 230)
            .moveDown();

        // line
        doc.moveTo(20,280)
            .lineTo(600,280)
            .stroke()
            .moveDown();

        // table
        let i,
            invoiceTableTop = 330;

        function tableHeader(doc) {
            doc
                .fontSize(10)
                .text("In or Out", 50, 330)
                .text("Date of Transfer", 150, 330)
                .text("Recipient", 280, 330)
                .text("Sum", 370, 330, { align: "right"});
        }

        // line
        tableHeader(doc);

        for (i = 0; i < results.length; i++) {
            const row = results[i];
            var inOrOut = row.in_or_out;
            var month = row.Date_Of_Transfer.getMonth()+1;
            var date = row.Date_Of_Transfer.getDate()+"/"+month.toString()+"/"+row.Date_Of_Transfer.getFullYear();
            var recipient = row.full_name;
            var amount = row.Amount_Transferred.toFixed(2).toString() + "£";
            var y = invoiceTableTop + (i + 1) * 30;

            if (inOrOut === "IN") {
                doc
                    .fillColor('green')
                    .fontSize(10)
                    .text(inOrOut, 50, y)
                    .fillColor('black')
                    .text(date, 150, y)
                    .text(recipient, 280, y)
                    .text(amount, 370, y, { align: "right"});
            } else {
                doc
                    .fillColor('red')
                    .fontSize(10)
                    .text(inOrOut, 50, y)
                    .fillColor('black')
                    .text(date, 150, y)
                    .text(recipient, 280, y)
                    .text(amount, 370, y, { align: "right"});
            }
        };

        getAvailableAmount(doc, customerID);

        doc.end();
    });
});

module.exports = router;
