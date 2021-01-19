// let userID = req.session.customerID;
let userID = parseInt(document.querySelector(".userID").innerText.substr(3));
console.log(userID)

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
            console.log(response.data.accountData);
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
        var availableBalance = parseInt(accountData[i].Current_Balance)+ 1500;//do maths here to calc avaible balance
        var btn = document.createElement("button");
        btn.innerText = "See Transfers";
        btn.classList.add("btn","btn-primary");
        console.log(btn);


        addAccountRow(accountDetails, currentBalance, availableBalance,btn);
    }
    console.log("success2");
}


//tr
//    th(scope='row')
//        | eSaver
//        br
//        | 09-01-26 12345678
//    td &pound; 10,123.00
//    td &pound; 10,123.00
//    td
//        button.btn.btn-primary(type='button') See Transfers

async  function addAccountRow(accountDetails, currentBalance,availableBalance, action){
    // we will insert data into table here
    var tbody = document.querySelector(".table-body");

    var tr = document.createElement("tr");
    var th = document.createElement("th");
    var currentBalanceTd = document.createElement("td");
    var availableBalanceTd = document.createElement("td");
    var btnTd = document.createElement("td");

    th.scope = "row";
    th.innerText = accountDetails;
    currentBalanceTd.innerText = "£" + currentBalance;
    availableBalanceTd.innerText = "£" + availableBalance.toString();
    btnTd.appendChild(action);

    tr.appendChild(th);
    tr.appendChild(currentBalanceTd);
    tr.appendChild(availableBalanceTd);
    tr.appendChild(btnTd);
    tbody.appendChild(tr);

    console.log("success3");
}
