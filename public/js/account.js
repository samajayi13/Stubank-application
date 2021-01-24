var userID = null;

getSession();

function getSession(){
     axios.get('/session/getSession', {
    }).then(function(response) {
            userID =   response.data.result.customerID;
            getAccounts(userID);
            getAvatar();
   })

 }



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
    })
}

function addAccounts(accountData){
    for(var i = 0; i < accountData.length; i++){
        console.log(accountData);
        // Name, Sort code + Account number, Current balance, Available balance, Action
        var accountDetails = accountData[i].Account_Name+"\n"+ accountData[i].Sort_Code+" "+accountData[i].Account_Number;
        var currentBalance = accountData[i].Current_Balance;
        var availableBalance = accountData[i].availableBalance.toString()
        var btn = document.createElement("button");
        btn.innerText = "See Transfers";
        btn.classList.add("btn","btn-primary");
        btn.id="button"+ accountData[i].ID.toString();
        addAccountRow(accountDetails, currentBalance, availableBalance,btn);
    }
}

async  function addAccountRow(accountDetails, currentBalance,availableBalance, action){
    // we will insert data into the table here
    var tbody = document.querySelector(".table-body");

    var tr = document.createElement("tr");
    var th = document.createElement("th");
    var currentBalanceTd = document.createElement("td");
    var availableBalanceTd = document.createElement("td");
    var btnTd = document.createElement("td");

    th.scope = "row";
    th.innerText = accountDetails;
    currentBalanceTd.innerText = "£" + currentBalance;
    availableBalanceTd.innerText = "£" + availableBalance;
    btnTd.appendChild(action);

    tr.appendChild(th);
    tr.appendChild(currentBalanceTd);
    tr.appendChild(availableBalanceTd);
    tr.appendChild(btnTd);
    tbody.appendChild(tr);
}

document.addEventListener("click",function(e){
    if(e.target.id === "btn-add-account") {
        return;
    }else if(e.target.classList.contains("btn")){
        var bankAccountIndex = e.target.id.substr(6);
        axios.post('/session/updateBankAccountIndex', {
                bankAccountIndex
        }).then(function(response) {
            window.location.href = "http://localhost:3000/transfers";
        })
    }
});

function getAvatar(){
    axios.get('/account/getAvatar', {
        //the parameters that is sent with the request
        params: {
            ID: userID,
        }
    })
        .then(function(response) {
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
