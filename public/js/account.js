// let userID = req.session.customerID;
let userID = parseInt(document.querySelector(".userID").innerText);


getAccounts(userID);
function getAccounts(userID){
    axios.get('/account/getAccounts', {
        //the parameters that is sent with the request
        params: {
            ID: userID,
        }
    })
        .then(function(response) {
            //what runs after the request has been made and successfully returned
            addAccounts(response.data.accountData)
            console.log("success1");
        })
        .catch(function(error) {
            console.log(error);
        })
}

function addAccounts(accountData){
    for(var i = 0; i < accountData.length; i++){
        // name, sort code+acc numer, curr balance, avail balance, Action
        var accountDetails = accountData[i].Account_Name+"\n"+ accountData[i].Sort_Code+" "+accountData[i].Account_Number;
        var currentBalance = accountData[i].Current_Balance;
        var action = "button.btn.btn-primary(type='button') See Transfers";

        addAccountRow(accountDetails, currentBalance, action);
    }
    console.log("success2");
}

async  function addAccountRow(accountDetails, currentBalance, action){
    // we will insert data into table here
    var tbody = document.querySelector(".table-body");

    var tr = document.createElement("tr");
    var trPounds = document.createElement("td &pound;")
    var th = document.createElement("th");
    var accountDetailsElm = document.createElement("td")
    var currentBalanceElm = document.createElement("td")
    var availableBalanceElm = document.createElement("td")
    var actionElm = document.createElement("td")

    th.scope = "row";

    accountDetailsElm.innerText = accountDetails;
    currentBalanceElm.innerText = currentBalance;
    availableBalanceElm.innerText = currentBalance;
    actionElm.innerText = action;


    tr.appendChild(accountDetailsElm);
    tr.appendChild(th);
    trPounds.appendChild(currentBalanceElm);
    trPounds.appendChild(availableBalanceElm);
    tr.appendChild(actionElm);
    tbody.appendChild(tr);

    console.log("success3");
}
