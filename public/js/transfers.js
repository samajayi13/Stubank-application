let userID = 1;

getTransfers(userID);

function getTransfers(userID){
    axios.get('/transfers/getTransfers', {
        //the parameters that is sent with the request
        params: {
            ID: userID
        }
    })
        .then(function(response) {
            //what runs after the request has been made and successfully returned
            console.log(response.data.transferData);
            addTransfers(response.data.transferData)
        })
        .catch(function(error) {
            console.log(error);
        })
}

function addTransfers(transferData){
    for(var i = 0; i < transferData.Length; i++){
        var amountTransfered = transferData.AmountTransfered;
        var dateOfTransfer = transferData.Date_Of_Transfer;
        var transferFromID = transferData.Transfer_From_ID;
        var transferToID = transferData.Transfer_To_ID;
        addTransferRow(amountTransfered, dateOfTransfer, transferFromID, transferToID);
    }
}
function addTransferRow(amountTransfered, dateOfTransfer, transferFromID, transferToID){

}
