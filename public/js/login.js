// forget password button that sends an email
document.querySelector("#forgot-password-btn").addEventListener("click",function(){
    axios.get('/login/checkIfEmailValid', {
        //the parameters that is sent with the request
        params: {
            email: document.querySelector("#forgot-password-email").value
        }
    })
        .then(function(response) {
            if(response.data.valid){
                sendEmail(document.querySelector("#forgot-password-email").value,
                    "Your account password",
                    "Your password is: ' " + response.data.password  + " ' if you have any problems please contact the bank");
            }else{
                alert("no email associated with this account");
            }
        });
})

// sends an email from the bank email address to given address with given subject and content
function sendEmail(toEmail,subject,body) {
    Email.send({
        Host: "smtp.gmail.com",
        Username: "stubank2021@gmail.com",
        Password: "NclStubank2021",
        To: toEmail,
        From: "stubank2021@gmail.com",
        Subject: subject,
        Body: body,
    })
        .then(function (message) {
            alert("Recovery email sent");
        });
}