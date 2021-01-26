userID = parseInt(document.querySelector(".userID").innerText.substr(4).trim());
var index = null;
var accountData = null;
var firstLoad = true;
getAccount(userID);

// fetches account data for logged in user and adds digital card
function getAccount(userID){
    axios.get('/digital_card/getAccount', {
        //the parameters that is sent with the request
        params: {
            ID: userID,
        }
    })
        .then(function(response) {
            //what runs after the request has been made and successfully returned
            accountData = response.data.accountData
            addCard(response.data.accountData)
            movePage();
        })
        .catch(function(error) {
            console.log(error);
        })
}

// makes card using given account data making the first bank card the active one
function addCard(accountData){
    for(var i = 0; i < accountData.length; i++){
        var dbCardNumber = accountData[i].Card_Number;
        var dbAccountNumber = accountData[i].Account_Number;
        var dbSortCode = accountData[i].Sort_Code;
        var dbAccountName = accountData[i].Account_Name;
        var dbDateOpened = accountData[i].Date_Opened;
        var dbExpiryDate = accountData[i].Expiry_Date;
        var dbCvvNumber = accountData[i].Cvv_Number;
        if(accountData[i].ID === bankAccountID){
            index = i;
            makeCard(dbCardNumber, dbAccountNumber, dbSortCode, dbAccountName, dbDateOpened, dbExpiryDate, dbCvvNumber,"active");
        }else{
            makeCard(dbCardNumber, dbAccountNumber, dbSortCode, dbAccountName, dbDateOpened, dbExpiryDate, dbCvvNumber,"");
        }
    }
}

// creates carousel item for digital card using the information given
function makeCard(dbCardNumber, dbAccountNumber, dbSortCode, dbAccountName, dbDateOpened, dbExpiryDate, dbCvvNumber,active){
    var cardCarouselInner = document.querySelector(".carousel-inner");
    var formattedDbExpiryDate = dbExpiryDate.substr(5,2)  + "/" + dbExpiryDate.substr(2,2);
    cardCarouselInner.innerHTML += `
<div class="carousel-item ${active}">
            <div class="bank-card">
              <img src="/images/logo.png" alt="logo" class="bank-card-logo">
              <div class="card__sim"></div>
              <div class="bank-card-number">
                  ${dbAccountNumber}
              </div>
              <span class="card-number-text">card-number</span>
              <div class="bank-card-expiry">
                  <div class="bank-card-expiry-text">
                    Expiry Date
                  </div>
                  <div class="bank-card-expiry-number">
                      ${formattedDbExpiryDate}
                  </div>
              </div>
              <div class="bank-card-bottom">
                  <span class="mr-3">${dbSortCode}</span>
                  <span>${dbAccountNumber}</span>
              </div>
              <div class="icons">
                  <i class="fab fa-cc-mastercard"></i>
                  <i class="fab fa-cc-visa"></i>
                  <i class="fab fa-apple-pay"></i>
              </div>
              <div class="account-name">
                  ${dbAccountName}
              </div>
          </div>
</div>`;
}

// next button that shows the next card or cycles back to the first card if on last card
document.querySelector(".carousel-control-next").addEventListener("click",function(e){
    if(index < accountData.length-1 && index  >= 0){
        index++;
    }else{
        index = 0;
    }
    movePage();
})
// previous button that shows the previous card or cycles back to the last card if on first card
document.querySelector(".carousel-control-prev").addEventListener("click",function(e){
    if(index  <= accountData.length-1 && index   >0){
        index--;
    }else{
            index = accountData.length-1;
    }
    movePage();
})

// moves the carousel to the current card index
function movePage(){
    document.querySelector(".carousel").style.backgroundColor = accountData[index].Card_Color;
    document.querySelector(".table-body").innerHTML = "";
    document.querySelector("#bankAccountName").innerText = accountData[index].Account_Name;
    document.querySelector("#bankAccountID").innerText = "ID " + accountData[index].ID;
    document.querySelector(".figure").innerText = "£" + accountData[index].Current_Balance.toString();

    if(!firstLoad){
        getTransfers(accountData[index].ID);
        axios.post('/session/updateBankAccountIndex', {
            bankAccountIndex : accountData[index].ID
        });
    }else{
        firstLoad = false;
    }

}