var userID = null;

getSession();

function getSession(){
    axios.get('/session/getSession', {
    }).then(function(response) {
        userID =   response.data.result.customerID;
        getAccountsEDocs(userID);
    })

}

function getAccountsEDocs(userID){
    axios.get('/e-documents/getEDocs', {
        //the parameters that is sent with the request
        params: {
            ID: userID,
        }
    })
        .then(function(response) {
            //what runs after the request has been made and successfully returned
            addAccountsEDocs(response.data.edocsData)
        })
}

function addAccountsEDocs(edocsData){
    for(var i = 0; i < edocsData.length; i++){
        console.log(edocsData);
        var accountDetails = edocsData[i].Account_Name+"\n"+ edocsData[i].Sort_Code+" "+edocsData[i].Account_Number;
        var btn = document.createElement("button");
        btn.innerText = "Get Statement";
        btn.classList.add("btn","btn-primary");
        btn.id="button"+ edocsData[i].ID.toString();
        addEDocsRow(accountDetails, btn);
    }
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


document.addEventListener("click",function(e){
    if(e.target.classList.contains("btn")){
        var bankAccountIndex = e.target.id.substr(6);
        axios.post('/session/updateBankAccountIndex', {
            bankAccountIndex
        }).then(function(response) {
            window.location.href = "http://localhost:3000/e-documents";
        })
    }
});