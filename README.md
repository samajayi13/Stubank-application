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

## Implementation

We will be using a Tomcat Server and a MySQL database to implement the application.

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
