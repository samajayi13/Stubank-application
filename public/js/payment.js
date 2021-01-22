var formBtn = document.querySelector(".btn");
var formIndex = 1;
var userID = null;
getSession();
function getSession(){
    axios.get('/session/getSession', {
    }).then(function(response) {
        userID = response.data.result.customerID;
        getUserAccounts();
    })

}
formBtn.addEventListener("click",function(e){
    // insert form validation here
    //moveForm allows the mutlistep form to take place
    moveForm("forward");
    e.preventDefault();
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
        document.querySelector(".btn-submit").style.display = "block";
        document.querySelector(".btn-continue").style.display = "none";
    }
}
document.querySelector(".btn-submit").addEventListener("click",function(e){
    document.querySelector(".form_3").style.display = "none";
    document.querySelector(".success-message").style.display = "block";
    document.querySelector(".transfer-form h3").style.display = "none";
    document.querySelector(".btn-submit").style.display = "none";
});

// document.querySelector("#sendingAccount").innerHTML = getUserAccounts();

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