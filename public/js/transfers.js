var bankAccountID = null;
getSession();
console.log("here");
// fetches session data for logged in user
function getSession(){
    axios.get('/session/getSession', {
    }).then(function(response) {
        console.log("here 1");;

        bankAccountID =  parseInt(response.data.result.bankAccountIndex);
        getTransfers(bankAccountID);
        getAvatar();
    })

}


// fetches transfers data for logged in user
function getTransfers(bankAccountID){
    console.log("here2");
    axios.get('/transfers/getTransfers', {
        //the parameters that is sent with the request
        params: {
            bankAccountID: bankAccountID,
        }
    })
    .then(function(response) {
        //what runs after the request has been made and successfully returned
        addTransfers(response.data.transferData)
    });
}

// creates parameters for given transfer data
function addTransfers(transferData){
    for(var i = 0; i < transferData.length; i++){
        var amountTransferred = transferData[i].Amount_Transferred;
        var dateOfTransfer = transferData[i].Date_Of_Transfer;
        var transferFromID = transferData[i].Transfer_From_Bank_Account_ID;
        var transferToID = transferData[i].Transfer_To_Bank_Account_ID;
        addTransferRow(amountTransferred,dateOfTransfer, transferFromID,transferToID);
    }
}

// adds a row to the page with the given parameters
async  function addTransferRow(amountTransferred,dateOfTransfer, transferFromID,transferToID){
    // we will insert data into table here
    var transferType = transferToID === bankAccountID ? "in" : "out";
    var transferUserID = transferType === "in" ? transferFromID : transferToID;
    var fromToName =  await getUserFirstName(transferUserID);

    var tbody = document.querySelector(".table-body");

    var tr = document.createElement("tr");
    var th = document.createElement("th");
    var firstNamElm = document.createElement("td")
    var amountTransferredElm = document.createElement("td")
    var dateSentElm = document.createElement("td")

    th.scope = "row";
    var span = document.createElement("span");

    if(transferType === "out"){
        span.classList.add("transaction-out","border","border-danger","rounded-circle");
    }else{
        span.classList.add("transaction-in","border","border-primary","rounded-circle");
    }

    span.innerText = transferType;

    firstNamElm.innerText = fromToName;
    amountTransferredElm.innerText = "£" + amountTransferred.toString();
    dateSentElm.innerText = dateOfTransfer.substr(0,10);
    th.appendChild(span);
    tr.appendChild(th);
    tr.appendChild(firstNamElm);
    tr.appendChild(amountTransferredElm);
    tr.appendChild(dateSentElm);
    tbody.appendChild(tr);

}

// gets the first name for the current user
async function getUserFirstName(transferUserID){
    var result = await  axios.get('/transfers/getUserFirstName', {
        params: {
            bankAccountID: transferUserID,
        }
    });

    result = result.data.transferData[0].First_Name;
    return result;
}

// gets the profile avatar for the current user
function getAvatar(){
    axios.get('/account/getAvatar', {
        //the parameters that is sent with the request
        params: {
            ID: userID,
        }
    })
        .then(function(response) {
            console.log(response.data.accountData[0].Avatar_Person);
            var avatar = response.data.accountData[0].Avatar_Person;
            if(avatar === "no-person"){
                document.querySelector('.account-box_top img').style.display  = "none";
                document.querySelector('i.fas.fa-user-circle').style.display  = "block";
            }else{
                document.querySelector('.account-box_top img').style.display  = "block";
                document.querySelector('.account-box_top img').src = avatar;
                document.querySelector('i.fas.fa-user-circle').style.display  = "none";
            }
        });
}
