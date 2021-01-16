var formBtn = document.querySelector("form .row .btn-next");
var btnPrevious = document.querySelector("form .row .btn-previous");
var progressNumber = 0;
var formIndex = 1;
var verificationCode = (Math.floor(Math.random() * 100000) + 10000).toString();
var emailSent = false

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

btnPrevious.addEventListener("click",function(e){
    moveForm("backwards");
})

function loop(formIndex){
    for(var i = 1; i<= 4;i++){
        var elm = document.querySelector(".main-form_"+i.toString());
        elm.style.display = i === formIndex ? "block" : "none";
    }
}

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
        alert("working");
        sendEmail(email,"Welcome to Stubank","Hi "+document.querySelector("#first-name").value+",\n" +
            "\n" +
            "Welcome to Stubank. We’re thrilled to see you here!\n" +
            "\n" +
            "We’re confident that our banking services will help you make the most out of your hard earn money! .\n" +
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

function form2Validation(){
    clearErrorMessages(document.querySelector(".main-form_2"));
    var password = document.querySelector("#password").value;
    var confirmPassword = document.querySelector("#confirm-password").value;

    if(!checkIfInputsEmpty(".main-form_2"))
        return false;
    if(password !== confirmPassword){
        updateErrorMessage(document.querySelector(".error-message-confirm-password"),"Password do not match")
        return false
    }
    return true;
}

function form3Validation(){
    clearErrorMessages(document.querySelector(".main-form_3"));
    if((!checkIfInputsEmpty(".main-form_3")) || (!validateTextField(["#univeristy"])))
        return false;
    return true;
}

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

function checkIfPhoneNumberValid(number) {
    let regex = /((07)|((\+|00)447)){1}[0-9]{9}\b/,
        result = regex.test(number);
    if(result === false)
        updateErrorMessage(document.querySelector(".error-message-phone-number"),"Phone number is invalid");
    return result;
}

function checkEmailValid(email){
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let valid = re.test(String(email).toLowerCase());
    if(valid === false)
        updateErrorMessage(document.querySelector(".error-message-email"),"Email is invalid");
    return valid;
}

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

function updateErrorMessage(formElement,message){
    formElement.innerText = message;
}

function clearErrorMessages(formElm){
    let childNodes = formElm.children;

    for (let childNode of childNodes) {
         childNode.childNodes[2].innerText = "";
    }
}

if(window.location.href.toString().includes("valid")){
    loop(55);
    $(".progress-bar").text(`100%`);
    $(".progress-bar").width(`100%`);
    btnPrevious.style.display = "none";
    formBtn.style.display = "none";
    document.querySelector("form h1").innerText = "Sign up complete!";
}

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

