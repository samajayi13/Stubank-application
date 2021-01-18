
getAccount(userID);
function getAccount(userID){
    axios.get('/digitalCard/getAccount', {
        //the parameters that is sent with the request
        params: {
            ID: userID,
        }
    })
        .then(function(response) {
            //what runs after the request has been made and successfully returned
            addCard(response.data.accountData)
        })
        .catch(function(error) {
            console.log(error);
        })
}

function addCard(accountData){
    for(var i = 0; i < accountData.length; i++){
        var dbCardNumber = accountData[i].Card_Number;
        var dbAccountNumber = accountData[i].Account_Number;
        var dbSortCode = accountData[i].Sort_Code;
        var dbAccountName = accountData[i].Account_Name;
        var dbDateOpened = accountData[i].Date_Opened;
        var dbExpiryDate = accountData[i].Expiry_Date;
        var dbCvvNumber = accountData[i].Cvv_Number;

        displayCard(dbCardNumber, dbAccountNumber, dbSortCode, dbAccountName, dbDateOpened, dbExpiryDate, dbCvvNumber);
    }
}

async  function displayCard(dbCardNumber, dbAccountNumber, dbSortCode, dbAccountName, dbDateOpened, dbExpiryDate, dbCvvNumber){
    getCard(userID);
}

async  function getCard(accountUserID){
    var result = await  axios.get('/digitalCard/getCard', {
        params: {
            userID: accountUserID,
        }
    });

    result = result.data.accountData[0].Card_Number;
    return result;
}

