# StuBank PLC: Platform for Students
### Overview
A new banking group made for students is launching in February 2021. StuBank PLC want to break into the banking market for students. They are joining the ever-growing list of online banks and in need of a platform for their customers to do everyday banking. 

 

### Client
This is a fictitious company that has been made for the purposes of this project. [Jordan Barnes](mailto://jordan.barnes@newcastle.ac.uk) will act as a customer for this project. 

 

### Requirements
- Banking functionality i.e. accounts, digital cards, transfers, etc
- Made for students
- Security is a priority i.e. encryption, 2FA, etc
- Machine learning on expenditure
    - tagging of outgoings
    - expenditure
 

### Information on StuBank PLC
As StuBank PLC are a new organisation, they have no branding guidelines. They want something that stands out and is unique.

## Set up

Make sure node.js is installed on your computer then open a terminal and run
```
git clone https://nucode.ncl.ac.uk/scomp/stage-2/csc2033-software-engineering-team-project/teams/Team-13/stubank-plc.git
cd stubank-plc
npm install
```
Then on MacOS or Linux, run the app with this command
```
DEBUG=stubank-plc:* npm start
```
On Windows Command Prompt, use this command
```
set DEBUG=myapp:* & npm start
```
On Windows PowerShell, use this command
```
$env:DEBUG='myapp:*'; npm start
```
You can then open http://localhost:3000/ to access the app.

## Implementation

We will be using Express.js, Node.js and a MySQL database to implement the application.

### Development of the System

- The web platform will include a user account which will allow the student to see their expenditures, transfers, and different accounts they hold with the bank.
- It will allow transfers between these accounts to be both internal and external, with alerts being sent to the users whenever a transaction is made, and will include digital cards for all user accounts
- Ensuring maximum security using encryption across networks and two factor authentication
- The use of machine learning to tag purchases into different groups e.g (food shopping, bills)
- Focusing on the needs of students, as opposed to business accounts:
    - Multiple accounts including current and savings
    - Many small transactions between these
    - A focus on budgeting
    - A system similar to Monzo/Starling is good for both budgeting and small quick transactions

Throughout development we will remember the target audience of the system. Features added, design/wording choices will need to be relevant and appeal to young adults.

### Technical Solution

We will implement a MySQL database which can add students when they join and delete them when they decide to terminate their account. There will also be other tables which will keep track of transfers/outgoings between accounts and the owner details of each account.
Key factors:
- The system will have to comply with GDPR, therefore the storage within the database will need to be encrypted
- For the two factor authentication, this could be an automated code generation that could be emailed to users. Counters will need to be used to generate the codes, and then check that the ones that are entered match
- The encryption used needs to have a high enough bits that the number of encryption combinations are vast enough. Banks are usually 256 bit. RSA encryption will be used as asymmetric encryption is 
- Machine learning can be used in our development so that predictions can be made about what group purchases fall into. Patterns can be identified through the names of shops/companies transferred to/from and the amount of money being transferred. These patterns can be used to group purchases into categories for budgeting and could also be used for collaborations with companies for free joining gifts to gain more users. There are libraries for machine learning that can be used to help us with these ideas which will be looked into further once the project is chosen.
- Node.js will be used to program the server and HTML/CSS/JavaScript/Ajax will be used for programming the browser

### Banking functionality:
- Accounts - current account and saving account
- Page to display account expenditures, transfers, and different accounts they hold with the bank.
- Digital cards 
- Transfers - alerts sent when made
- Encryption and 2FA (automated code generation that could be emailed to users)
    - Hashed passwords 
    - Email 4 digit number for authentication when you are trying to log in
    - Encrypting all of the users information
    - Generate security code each time user wants to send money 
- Student account - no interest on your overdraft.
- Personal account - interest on overdraft 
- Student account they will automatically get £100 
- When the person graduates they are notified they will be switching to personal
- Machine learning on expenditures 
    - Save people you have sent money to in the past
    - Trends on expenditures 
        - Ask for pin if it does not match trend e.g. spending too much at one go
    - Keeping track of overall spending from all accounts to make sure the bank has enough money and does not go bust 

