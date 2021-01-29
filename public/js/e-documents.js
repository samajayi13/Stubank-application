var userID = null;

getSession();


//gets session attributes
function getSession(){
    axios.get('/session/getSession', {
    }).then(function(response) {
        userID =   response.data.result.customerID;
        getAccountsEDocs(userID);
    })

}


//gets all bankaccounts owned by the user
function getAccountsEDocs(userID){
    axios.get('/e-documents/getEDocs', {
        //the parameters that is sent with the request
        params: {
            ID: userID,
        }
    })
        .then(function(response) {
            //what runs after the request has been made and successfully returned
            addAccountsEDocs(response.data.edocsData);
        })
}


//gets account to the table on e document page
function addAccountsEDocs(edocsData){
    for(var i = 0; i < edocsData.length; i++){
        var currentBTNID = "button"+ edocsData[i].ID.toString();
        console.log(edocsData);
        var accountDetails = edocsData[i].Account_Name+"\n"+ edocsData[i].Sort_Code+" "+edocsData[i].Account_Number;
        var btn = document.createElement("a");
        btn.innerText = "Get Statement";
        btn.classList.add("btn","btn-primary");
        btn.id="button"+ edocsData[i].ID.toString();

        addEDocsRow(accountDetails, btn);
    }
}

//gets account row to the table on e document page
async  function addEDocsRow(accountDetails, action){
    // we will insert data into table here
    var tbody = document.querySelector(".table-body");

    var tr = document.createElement("tr");
    var th = document.createElement("th");
    var btnTd = document.createElement("td");

    th.scope = "row";
    th.innerText = accountDetails;
    btnTd.appendChild(action);

    tr.appendChild(th);
    tr.appendChild(btnTd);
    tbody.appendChild(tr);
}

//when the account button is clicked shows them their bank statement
document.addEventListener("click",function(e){
    if(e.target.classList.contains("btn")){
        var bankAccountIndex = e.target.id.substr(6);
        axios.post('/session/updateBankAccountIndex', {
            bankAccountIndex
        }).then(function(response) {
            window.location.href = "http://localhost:3000/single_e-doc";
        })
    }
});