var formBtn = document.querySelector(".btn");
var formIndex = 1;
var userID = null;
var email = null;
var randomNumber = null;
getSession();
function getSession(){
    axios.get('/session/getSession', {
    }).then(function(response) {
        userID = response.data.result.customerID;
        email = response.data.result.email;
        getUserAccounts();
    })

}

formBtn.addEventListener("click",function(e){
    e.preventDefault();
    // insert form validation here
    //moveForm allows the mutlistep form to take place
    var amount = document.querySelector("#sendAmount").value;
    var accountName = document.querySelector("#sendingAccount").value;
    var accountNumber = document.querySelector("#receivingAccount").value;
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
    if(accountName && formIndex === 2){
        axios.get('/payment/checkBalanceForAccount', {
            params : {
                ID : userID,
                amount : amount,
                accountName : accountName
            }
        }).then(function(response) {
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

    if(formIndex === 3 && document.querySelector("#passCode").value){
        if(document.querySelector("#passCode").value !== randomNumber.toString()){
            alert("Invalid passcode");
        }else{
            alert("working!");
            // moveForm("forward");
            axios.post('/payment/createPayment', {
                    amountSent: document.querySelector('#sendAmount').value,
                    transferDescription: document.querySelector("#transferPurpose").value,
                    bankAccountName : document.querySelector("#sendingAccount").value,
                    userID : userID,
                    accountSendingToNumber : document.querySelector("#receivingAccount").value,
                    sendingToPot : document.querySelector("#savings-pot-check").checked
            }).then(function(){
                document.querySelector(".form_3").style.display = "none";
                document.querySelector(".success-message").style.display = "block";
                document.querySelector(".transfer-form h3").style.display = "none";
                document.querySelector(".btn-continue").style.display = "none";
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

// document.querySelector("#sendingAccount").innerHTML = getUserAccounts();

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
function sendEmail(toEmail,subject,body) {
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
            alert("mail sent successfully")
        });
}