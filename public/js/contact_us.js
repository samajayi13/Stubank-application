document.querySelector(".btn-submit").addEventListener("click",function(){
    var email = document.querySelector("#email").value;
    var firstName = document.querySelector("#first-name").value;
    var lastName = document.querySelector("#last-name").value;
    var number = document.querySelector("#phone-number").value;
    var message = document.querySelector("#message").value;
    console.log("working");
    sendEmail("stubank2021@gmail.com","New message",`
        email : ${email}, first name : ${firstName}, first name : ${lastName}, number : ${number}, message: "${message}"
    `,"Message successfully sent");
});


/**
 * sends email to stubank after user contacts us
 * @param toEmail stubank's address
 * @param subject is the subject of the message
 * @param body is the content of message
 * @param alertMessage text to alert after message has been sent
 */
function sendEmail(toEmail,subject,body,alertMessage = "mail sent successfully") {
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
            alert(alertMessage);
            window.location.href = "http://localhost:3000/contact_us";

        });
}