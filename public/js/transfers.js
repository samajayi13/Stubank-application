let userID = parseInt(document.querySelector(".userID").innerText);


getTransfers(userID);
function getTransfers(userID){
    axios.get('/transfers/getTransfers', {
        //the parameters that is sent with the request
        params: {
            ID: userID,
        }
    })
        .then(function(response) {
            //what runs after the request has been made and successfully returned
            addTransfers(response.data.transferData)
        })
        .catch(function(error) {
            console.log(error);
        })
}

function addTransfers(transferData){
    for(var i = 0; i < transferData.length; i++){
        var amountTransferred = transferData[i].Amount_Transfered;
        var dateOfTransfer = transferData[i].Date_Of_Tranfer;
        var transferFromID = transferData[i].Transfer_From_ID;
        var transferToID = transferData[i].Transfer_To_ID;

        addTransferRow(amountTransferred,dateOfTransfer, transferFromID,transferToID);
    }
}

async  function addTransferRow(amountTransferred,dateOfTransfer, transferFromID,transferToID){
    // we will insert data into table here
    var transferType = transferToID === userID ? "in" : "out";
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
    amountTransferredElm.innerText = amountTransferred;
    dateSentElm.innerText = dateOfTransfer.substr(0,10);
    th.appendChild(span);
    tr.appendChild(th);
    tr.appendChild(firstNamElm);
    tr.appendChild(amountTransferredElm);
    tr.appendChild(dateSentElm);
    tbody.appendChild(tr);

}

async function getUserFirstName(transferUserID){
    var result = await  axios.get('/transfers/getUserFirstName', {
        params: {
            userID: transferUserID,
        }
    });

    result = result.data.transferData[0].First_Name;
    return result;
}

