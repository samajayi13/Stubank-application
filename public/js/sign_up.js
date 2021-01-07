// // reuqirments
// - check if all fields are not empty
// - if phone number is real
// - check if email is real

var formBtn = document.querySelector("form .row .btn-next");
var btnPrevious = document.querySelector("form .row .btn-previous");
var progressBar = document.querySelector(".progress-bar");
var progressNumber = 25;
var formIndex = 1;

formBtn.addEventListener("click",function(e){
    let  formValidated = true;

    if(formIndex === 1){
        formValidated = form1Validation();
    }
    else if(formIndex === 2){
        // formValidated = form2Validation();
    }else if (formIndex ===3 ){
        // formValidated = form3Validation();
    }

    if(formValidated){
        moveForm("forward");
    }

    e.preventDefault();
})

btnPrevious.addEventListener("click",function(e){
    //do validation based on number
    moveForm("backwards");
    e.preventDefault();
})

function moveForm(direction){
    function loop(formIndex){
        for(var i = 1; i<= 3;i++){
            var elm = document.querySelector(".main-form_"+i.toString());
            elm.style.display = i === formIndex ? "block" : "none";
        }
    }
    if(direction === "forward" && formIndex <=3 ){
        progressNumber += 25;
        formIndex++;
        loop(formIndex);
    }else if(direction === "backwards" && formIndex > 1 ){
        progressNumber -= 25;
        formIndex--;
        loop(formIndex);
    }
    if(formIndex <= 3 && formIndex >1){
        btnPrevious.style.display = "block";
    }else if(formIndex === 4){
        btnPrevious.style.display = "none";
        formBtn.style.display = "none";
        document.querySelector("form h1").innerText = "Sign up complete!"
    }else{
        btnPrevious.style.display = "none";
    }
    $(".progress-bar").text(`${progressNumber}%`);
    $(".progress-bar").width(`${progressNumber}%`);
}


function form1Validation(){
    checkIfInputsEmpty(".main-form_1");
    // checkNumberValid();
    // checkEmailVaid();
    // validateTextField();
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

function checkNumberValid(){

}

function checkEmailVaid(){

}

function validateTextField(){

}

function updateErrorMessage(formElement,message){
    formElement.innerText = message;
}