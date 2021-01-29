var formBtn = document.querySelector("form .row .btn-next");
var btnPrevious = document.querySelector("form .row .btn-previous");
var progressNumber = 0;
var formIndex = 1;
var verificationCode = (Math.floor(Math.random() * 100000) + 10000).toString();
var emailSent = false


// checks form validation and moves form forward if valid
formBtn.addEventListener("click",function(e){
    let  formValidated = true;

    if(formIndex === 1){
        formValidated = form1Validation();
    }else if(formIndex === 2){
        formValidated = form2Validation();
    }else if (formIndex ===3 ){
        formValidated = form3Validation();
    }else if (formIndex ===4 ){
        formValidated = form4Validation();
    }

    if(formValidated){
        moveForm("forward",e);
    }
})

// button to move form backwards
btnPrevious.addEventListener("click",function(e){
    moveForm("backwards");
})

function loop(formIndex){
    for(var i = 1; i<= 4;i++){
        var elm = document.querySelector(".main-form_"+i.toString());
        elm.style.display = i === formIndex ? "block" : "none";
    }
}

/**
 * moves form forward and sends welcome email when complete
 * @param direction is the movement the form will undergo
 * @param e is the event
 */
function moveForm(direction,e){
    if(direction === "forward" && formIndex <=4 ){
        progressNumber += 25;
        formIndex++;
        loop(formIndex);
    }else if(direction === "backwards" && formIndex > 1 ){
        progressNumber -= 25;
        formIndex--;
        loop(formIndex);
    }
    if(formIndex <= 4 && formIndex >1){
        btnPrevious.style.display = "block";
    }else if(formIndex === 5){
        sendEmail(email,"Welcome to Stubank","Hi "+document.querySelector("#first-name").value+",\n" +
            "\n" +
            "Welcome to Stubank. We’re thrilled to see you here!\n" +
            "\n" +
            "We’re confident that our banking services will help you make the most out of your hard earned money! .\n" +
            "\n" +
            " Please login to to ensure you get the very best out of our service at http://localhost:3000/account.\n" +
            "\n" +
            "Your username:"+ document.querySelector("#username").value +
            "\n Your password:"+ document.querySelector("#password").value + " \n" +
            "\n" +
            "Take care!\n" +
            "Stubank")
        formBtn.type = "submit";
    }
    $(".progress-bar").text(`${progressNumber}%`);
    $(".progress-bar").width(`${progressNumber}%`);

}

// validates phone number and email, returns true if valid, and sends verification code to email
function form1Validation(){
     email = document.querySelector("#email").value;
    clearErrorMessages(document.querySelector(".main-form_1"));
    if(!checkIfInputsEmpty(".main-form_1"))
        return false;
    if((!checkIfPhoneNumberValid(document.querySelector("#phone-number").value)) ||
        (!checkEmailValid(email))||
        (!validateTextField(["#first-name","#last-name"]))){return false;}

    if(emailSent === false){
        emailSent = true;
        sendEmail(email,"Verification code",verificationCode);
        alert(`Verification code has been sent to your email ! "${email}"`);
    }
    return true;
}

// validates password, returns true if valid
function form2Validation(){
    clearErrorMessages(document.querySelector(".main-form_2"));
    var password = document.querySelector("#password").value;
    var confirmPassword = document.querySelector("#confirm-password").value;

    if(!checkIfInputsEmpty(".main-form_2"))
        return false;
    if(password !== confirmPassword){
        updateErrorMessage(document.querySelector(".error-message-confirm-password"),"Password do not match")
        return false
    }else{
        if(scoreForPassword(password)<=59){
            updateErrorMessage(document.querySelector(".error-message-confirm-password"),"Password is too week")
            return false;
        }
    }
    return true;
}


/**
 * checks if password is strong or week
 * @param password is the password entered by the user
 * @returns {number} is the score assigned to the user based on if the password is strong or week
 */
function scoreForPassword(password) {
    var valid = 0;
    if (!password)
        return valid;
    
    var letters = new Object();
    for (var i=0; i<password.length; i++) {
        letters[password[i]] = (letters[password[i]] || 0) + 1;
        valid += 5.0 / letters[password[i]];
    }

    var typesV = {
        digits: /\d/.test(password),
        lower: /[a-z]/.test(password),
        upper: /[A-Z]/.test(password),
        nonWords: /\W/.test(password),
    }

    var countV = 0;
    for (var check in typesV) {
        countV += (typesV[check] == true) ? 1 : 0;
    }
    valid += (countV - 1) * 10;

    return parseInt(valid);
}

// validates university, returns true if valid
function form3Validation(){
    clearErrorMessages(document.querySelector(".main-form_3"));
    if((!checkIfInputsEmpty(".main-form_3")) || (!validateTextField(["#univeristy"])))
        return false;
    return true;
}

// validates verification code, returns true if valid
function form4Validation(){
    clearErrorMessages(document.querySelector(".main-form_4"));
    if((!checkIfInputsEmpty(".main-form_4")) || (!validateTextField(["#univeristy"]))){
        return false;
    }else{
        var userInput = document.querySelector("#verification-code").value;
        console.log(verificationCode);
        if(verificationCode !== userInput) {
            updateErrorMessage(document.querySelector(".error-message-verification-code"), "invalid verification code");
            return false;
        }
    }
    return true;
}

/**
 * checks if inputs are empty
 * @param formName is the name of the form
 * @returns {boolean}
 */
function checkIfInputsEmpty(formName) {
    let valid = true;
    let formElm = document.querySelector(`${formName}`);
    let childNodes = formElm.children;

    for (let childNode of childNodes) {
        let inputValue = childNode.childNodes[1].value.trim();
        let errorMessageElement = childNode.childNodes[2];

        if (inputValue === null || inputValue === undefined || inputValue === ""){
            updateErrorMessage(errorMessageElement,"* Field required")
            valid  = false;
        }
    }

    return valid;
}

/**
 * validates phone number, returns true if valid
 * @param number is the number to be check
 * @returns {boolean}
 */
function checkIfPhoneNumberValid(number) {
    let regex = /((07)|((\+|00)447)){1}[0-9]{9}\b/,
        result = regex.test(number);
    if(result === false)
        updateErrorMessage(document.querySelector(".error-message-phone-number"),"Phone number is invalid");
    return result;
}

/**
 * validates email, returns true if valid
 * @param email is the email to be validated
 * @returns {boolean}
 */
function checkEmailValid(email){
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let valid = re.test(String(email).toLowerCase());
    if(valid === false)
        updateErrorMessage(document.querySelector(".error-message-email"),"Email is invalid");
    return valid;
}

/**
 * validates if input is text, returns true if valid
 * @param elements is the textfields to be validated
 * @returns {boolean}
 */
function validateTextField(elements){
    let valid = true;

    for(var elm of elements){
        validate(document.querySelector(`${elm}`).value,elm);
    }

    function validate(value,elementName){
        let containsNumbers =  /\d/.test(value);
        if(containsNumbers === true){
            valid = false;
            updateErrorMessage(document.querySelector(".error-message-"+elementName.slice(1)),"* Field cannot contain numbers");
        }
    }
    return valid;

}

//display error message to user
function updateErrorMessage(formElement,message){
    formElement.innerText = message;
}

//remove error message from webpage
function clearErrorMessages(formElm){
    let childNodes = formElm.children;

    for (let childNode of childNodes) {
         childNode.childNodes[2].innerText = "";
    }
}

// displays progress bar for sign up form
if(window.location.href.toString().includes("valid")){
    loop(55);
    $(".progress-bar").text(`100%`);
    $(".progress-bar").width(`100%`);
    btnPrevious.style.display = "none";
    formBtn.style.display = "none";
    document.querySelector("form h1").innerText = "Sign up complete!";
}

/**
 * sends an email from the bank email address to given address with given subject and content
 * @param toEmail is the email that data is being sent to
 * @param subject is the subject of the email
 * @param body is the body of the email
 */
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



