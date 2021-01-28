var formBtn = document.querySelector(".btn");
var formIndex = 1;
var userID = null;
var email = null;
var randomNumber = null;
var otherPersonID = null;
var sendingFromID = null;
getSession();

// fetches session data for login user and gets their accounts
function getSession(){
    axios.get('/session/getSession', {
    }).then(function(response) {
        userID = response.data.result.customerID;
        email = response.data.result.email;
        getUserAccounts();
    })

}

// validates form input
formBtn.addEventListener("click",function(e){
    e.preventDefault();
    // insert form validation here
    //moveForm allows the mutlistep form to take place
    var amount = document.querySelector("#sendAmount").value;
    var accountName = document.querySelector("#sendingAccount").value;
    var accountNumber = document.querySelector("#receivingAccount").value;

    // validates if user has enough money in their accounts for transfer
    if(amount && formIndex === 1){
        if(document.querySelector("#savings-pot-check").checked){
            alert((Math.ceil(amount) - amount).toFixed(2).toString() + " will be sent to your savings pot");
        }
        axios.get('/payment/checkBalance', {
            params : {
                ID : userID,
                amount : amount
            }
        }).then(function(response) {
            var valid = response.data.valid;
            if(valid){
                moveForm("forward");
            }else{
                alert("Not enough money in any account to make transfer");
            }
        });
    }
    // validates if target account number exists and sends verification code to email if it does
    if(accountName && formIndex === 2){
        axios.get('/payment/checkBalanceForAccount', {
            params : {
                ID : userID,
                amount : amount,
                accountName : accountName
            }
        }).then(function(response) {
            sendingFromID = response.data.bankAccountID;
            var valid = response.data.valid;
            if(valid){
                if(accountNumber && formIndex === 2){
                    axios.get('/payment/checkIfAccountValid', {
                        params : {
                            accountNumber : accountNumber
                        }
                    }).then(function(response) {
                        var accountNameValid = response.data.valid;
                        if(accountNameValid){
                            moveForm("forward");
                            send2FAEmail();
                            otherPersonID = response.data.bankAccountID;
                        }else{
                            alert(`The account number  ${accountNumber} does not exist`);
                        }
                    });
                }
            }else{
                alert(`Not enough money in ${accountName} to make transfer`);
            }
        });
    }

    // validates if verification code is correct and makes transfer if it does
    if(formIndex === 3 && document.querySelector("#passCode").value){
        if(document.querySelector("#passCode").value !== randomNumber.toString()){
            alert("Invalid passcode");
        }else{
            // moveForm("forward");
            axios.post('/payment/createPayment', {
                    amountSent: document.querySelector('#sendAmount').value,
                    transferDescription: document.querySelector("#transferPurpose").value.replace(/[0-9]/g, '').trimStart().trimEnd(),
                    bankAccountName : document.querySelector("#sendingAccount").value,
                    userID : userID,
                    accountSendingToNumber : document.querySelector("#receivingAccount").value,
                    sendingToPot : document.querySelector("#savings-pot-check").checked,
                    sendingFromID : sendingFromID,
                    otherPersonID : otherPersonID
            }).then(function(){
                document.querySelector(".form_3").style.display = "none";
                document.querySelector(".success-message").style.display = "block";
                document.querySelector(".transfer-form h3").style.display = "none";
                document.querySelector(".btn-continue").style.display = "none";
                sendEmail(email,"Payment confirmation",`
                    Payment made on ${new Date().toLocaleString()} of ${document.querySelector('#sendAmount').value} sent to ${document.querySelector("#receivingAccount").value} with description of "${document.querySelector("#transferPurpose").value.replace(/[0-9]/g, '').trimStart().trimEnd()}"
                `,"receipt has been sent to you email :" + email);
            })
        }
    }


})
//MOVES THE FORM FORWARD AND SHOWS A NEW STEP IN THE FORM
function moveForm(direction){
    formIndex++;
    function setDisplayProperty(formIndex){
        for(var i = 1; i<= 3;i++){
            var elm = document.querySelector(".form_"+i.toString());
            elm.style.display = i === formIndex ? "block" : "none";
            console.log(elm);
        }
    }
    setDisplayProperty(formIndex);
    if (direction === "forward" && formIndex === 3 ) {
        document.querySelector(".btn-continue").innerText = "Submit transfer"
    }
}


// gets bank account for current user and adds them to drop down list so they can be selected
function getUserAccounts(){
    let userAccounts = null;
    axios.get('/payment/getUserAccounts', {
        params : {
            ID : userID
        }
    }).then(function(response) {
        userAccounts = response.data.userAccounts;
        for(var i = 0; i < userAccounts.length; i ++){
            document.querySelector("#sendingAccount").innerHTML +=`
                <option> ${userAccounts[i].Account_Name} </option>
            `;
        }
    });
}

// sends a verification email with a code that you need to enter to make the payment
function send2FAEmail(){
    randomNumber = Math.floor(Math.random() * (999999 - 111111) + 111111);
    sendEmail(email,"Verification Code",`Your code is ${randomNumber.toString()}`);
}

// sends an email from the bank email address to given address with given subject and content
function sendEmail(toEmail,subject,body,alertMessage = "mail sent successfully") {
    Email.send({
        Host: "smtp.gmail.com",
        Username: "stubank2021@gmail.com",
        Password: "NclStubank2021",
        To: toEmail,
        From: "stubank2021@gmail.com",
        Subject: subject,
        Body: body,
    })
        .then(function (message) {
            alert(alertMessage);
        });
}