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
var tableBalance = null;
//gets user's transfers
function getUsersTransfers(){
    console.log(userData.bankAccountIndex);
    axios.get('/single_e-doc/getUsersTransfers', {
        params : {
            bankAccountIndex : userData.bankAccountIndex
        }
    }).then(function(response) {
        console.log("here");
        console.log(response);
        if( response.data.transfers){
            document.querySelector(".account-number").innerText = response.data.transfers[0].Account_Number;
            getInAndOutBalance(response.data.transfers);
            tableBalance = openingBalance;
            response.data.transfers.forEach(function(x){
                addTransactionRow(x);
            })
            addClosingRow(response.data.transfers[0]);
        }else{
            alert("statement empty ! please make some transfers to see a statement");
        }
    });
}

/**
 * addes use's full name to document
 * @param userData is the object containing the user information
 */
function updateFullName(userData){
    let fullName = userData.firstName + " " + userData.lastName;
    document.querySelector(".user-name").innerText = fullName;
}
var openingBalance = 0;

/**
 * gets the sum about of money that went in and out of the user account
 * @param transfers
 */
function getInAndOutBalance(transfers){
    var results = transfers.reduce(function(accum,x){
        if(x.in_or_out === "IN"){
            accum.in += x.Amount_Transferred;
            openingBalance -=x.Amount_Transferred;
        }else{
            accum.out += x.Amount_Transferred;
            openingBalance += x.Amount_Transferred;
        }
        return accum;
    },{in: 0, out: 0});
    console.log(results);
    document.querySelector(".opening-balance").innerText = "£" + openingBalance.toFixed(2).toString();
    document.querySelector(".withdraw-figure").innerText = "£" + results.out.toFixed(2).toString();
    document.querySelector(".depoisits-figure").innerText = "£" + results.in.toFixed(2).toString();
    document.querySelector(".closing-balance-figure").innerText = "£" + transfers[0].Current_Balance;
    document.querySelector(".table-opening-balance").innerText = "£" + openingBalance.toFixed(2);
}

//updates date values on document
function updateDate(){
    document.querySelector(".date-statement").innerText = "For " + todayDate;
    document.querySelector(".closing-balance-date").innerText = "Closing balance on " + todayDate;
    var month = new Date().toISOString().slice(0,7).replace("-","/");
    document.querySelector(".opening-balance-date").innerText = "Opening balance on " + month;
    document.querySelector(".table-opening-balance-row-date").innerText = month;
}


/**
 * addes  transfer to table
 * @param transfer is the transaction made
 */
function addTransactionRow(transfer){
    // we will insert data into table here
    var tbody = document.querySelector("tbody");
    var tr = document.createElement("tr");
    var th = document.createElement("th");
    var descriptionTD = document.createElement("td");
    var withdrawlsTD = document.createElement("td");
    var depositsTD = document.createElement("td");
    var balanceTD = document.createElement("td");

    th.scope = "row";
    descriptionTD.innerText = transfer.full_name + " " + transfer.Account_Number;
    if(transfer.in_or_out === "OUT"){
        withdrawlsTD.innerText = transfer.Amount_Transferred;
        tableBalance -= transfer.Amount_Transferred;
        balanceTD.innerText = "£" + Math.round(tableBalance).toString();

    }else if(transfer.in_or_out === "IN"){
        depositsTD.innerText = transfer.Amount_Transferred;
         tableBalance += transfer.Amount_Transferred;
        balanceTD.innerText = "£" + Math.round(tableBalance).toString();
    }
    console.log(typeof transfer.Amount_Transferred);
    tr.appendChild(th);
    tr.appendChild(descriptionTD);
    tr.appendChild(withdrawlsTD);
    tr.appendChild(depositsTD);
    tr.appendChild(balanceTD);
    tbody.appendChild(tr);
}

/**
 * addes closing transfer to table
 * @param transfer is the transaction made
 */
function addClosingRow(transfer){
    // we will insert data into table here
    var tbody = document.querySelector("tbody");
    var tr = document.createElement("tr");
    var th = document.createElement("th");
    var descriptionTD = document.createElement("td");
    var withdrawlsTD = document.createElement("td");
    var depositsTD = document.createElement("td");
    var balanceTD = document.createElement("td");

    tr.classList.add("table-closing-balance-row");
    th.scope = "row";
    descriptionTD.innerText = "Closing balance";
    balanceTD.innerText = "£" + transfer.Current_Balance;
    withdrawlsTD.innerText = " ";
    depositsTD.innerText = " ";
    tr.appendChild(th);
    tr.appendChild(descriptionTD);
    tr.appendChild(withdrawlsTD);
    tr.appendChild(depositsTD);
    tr.appendChild(balanceTD);
    tbody.appendChild(tr);
}