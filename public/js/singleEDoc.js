getSession();
var userData = {}
var todayDate = new Date().toISOString().slice(0,10);
function getSession(){
    axios.get('/session/getSession', {
    }).then(function(response) {
        userData = response.data.result
        updateFullName(userData);
        updateDate();
        getUsersTransfers();
    })

}

function getUsersTransfers(){
    axios.get('/singleEDoc/getUsersTransfers', {
        params : {
            bankAccountIndex : userData.bankAccountIndex
        }
    }).then(function(response) {
        console.log(response);
    })
}
function updateFullName(userData){
    let fullName = userData.firstName + " " + userData.lastName;
    document.querySelector(".user-name").innerText = fullName;
}

function updateDate(){
    document.querySelector(".date-statement").innerText = "For " + todayDate;
    document.querySelector(".closing-balance-date").innerText = "Closing balance on " + todayDate;
    var month = new Date().toISOString().slice(0,7).replace("-","/");
    document.querySelector(".opening-balance-date").innerText = "Opening balance on " + month;

}