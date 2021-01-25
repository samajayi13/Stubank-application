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
            addAccountsEDocs(response.data.edocsData);
        })
}

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
        var bankAccountID = e.target.id.substr(6);
        axios.get('/e-documents/getStatementInfo', {
            params : {
                bankAccountID,
                responseType: 'blob'
            }
        }).then(function(response) {
            console.log(response);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'statement.pdf'); //or any other extension
            document.body.appendChild(link);
            link.click();
        });
    }
});