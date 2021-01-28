var userData = {}
getSession();
var index = 0 ;

$('#btn-save-changes').prop('disabled', true);

function getSession(){
    axios.get('/session/getSession', {
    }).then(function(response) {
        var data = response.data.result;
        userData = {
            userID : data.customerID,
            email : data.email,
            firstName : data.firstName,
            lastName : data.lastName,
            phoneNumber : data.phoneNumber,
            studentID : data.studentID,
            uniName : data.universityName,
            username : data.username,
            cards : []
        }
        getRemainingUserData();
        $('#btn-save-changes').prop('disabled', false);
    })

}
function getRemainingUserData(){
    axios.get('/users_settings/getUserDetails', {
        params : {
            customerID : userData.userID
        }
    }).then(function(response) {
        console.log(response);
        var data = response.data.userData;
        userData.accountTypeDesc = data[0].Account_Types_Description;
        userData.dateSigedUp = data[0].Registration_Date;
        userData.password = data[0].Password;
        userData.avatarPerson = data[0].Avatar_Person;
        data.forEach(function(x){
            userData.cards.push({
                cardColor : x.Card_Color,
                cardNumber : x.Card_Number,
                accountName : x.Account_Name,
                accountNumber : x.Account_Number,
                expiryDate : x.Expiry_Date.substr(5,2)  + "/" + x.Expiry_Date.substr(2,2),
                sortCode : x.Sort_Code,
            })
        })
         makeFormHTML();
    })
}

function makeFormHTML(){
    document.querySelector("#user-ID").value  = userData.userID;
    document.querySelector("#username").value = userData.username;
    document.querySelector("#signed-up-date").value = userData.dateSigedUp.substr(0,10);
    document.querySelector("#customer-type").value = userData.accountTypeDesc;
    document.querySelector("#first-name").value = userData.firstName;
    document.querySelector("#last-name").value = userData.lastName;
    document.querySelector("#phone-number").value = userData.phoneNumber;
    document.querySelector("#email").value = userData.email;
    document.querySelector("#uni-name").value = userData.uniName;
    document.querySelector("#studetn-ID").value = userData.studentID;

    userData.cards.forEach(function(x){
        document.querySelector("#bank-accounts").innerHTML  +=`
            <option> ${x.accountName} </option>
        `;
        makeCard(x);
    });
    makeAvatarModal();
}

function makeAvatarModal() {
    var avatarPictures = document.querySelector(".pictures");
    var avatarMenPhotos = [1,2,3,4,5,6,7,8,9,18,19,20,21,22,23,24,25,26,35,36,37,38,39,40,41,42];

    for(var i = 1 ; i<= 50; i ++) {
        var imgSrc = "";
         if(avatarMenPhotos.includes(i)){
             if(i.toString().length === 1){
                 imgSrc = "/images/" +"00"+ i.toString() + "-man.png";
             }else{
                 imgSrc = "/images/" +"0"+ i.toString() + "-man.png";
             }
         } else{
             if(i.toString().length === 1){
                 imgSrc = "/images/" +"00"+ i.toString() + "-woman.png";
             }else{
                 imgSrc = "/images/" +"0"+ i.toString() + "-woman.png";
             }
         }
        avatarPictures.innerHTML += `<img src="${imgSrc}" alt="" data-dismiss="modal" class="avatar-elm"> `;
    }


    if(userData.avatarPerson === "no-person"){
        document.querySelector('.card-body.media img').src="/images/n-a.png";

    }else{
        document.querySelector('.card-body.media img').src=userData.avatarPerson;
    }

}

document.querySelector("#bank-accounts").addEventListener("click",function(){
    var currentValue = this.value;
    index = 0 ;
    userData.cards.forEach(function(x,i){
        index = x.accountName === currentValue ? i : index;
    })
    console.log("current value: " + currentValue);
    console.log(index);
    var cardsChildren = document.querySelector(".carousel-inner").children;
    for(var i = 0; i <= cardsChildren.length-1; i ++){
        console.log(i);
        if(i !== index){
            console.log(i + " does not eqaul to " + index);
            document.querySelector(".carousel-inner").children[i].classList.remove("active");
        }else{
            console.log(i +" does eqaul to " + index);
            console.log(userData.cards[i].accountName);
            document.querySelector(".carousel-inner").children[i].classList.add("active");
            console.log(document.querySelector(".carousel-inner").children[i]);
            console.log(document.querySelector(".carousel-inner").children[i].classList);
            document.querySelector(".carousel").style.backgroundColor = userData.cards[i].cardColor;
        }
    }
})

document.querySelector(".carousel-control-next").addEventListener("click",function(e){
    if(index < userData.cards.length-1 && index  >= 0){
        index++;
    }else{
        index = 0;
    }
    document.querySelector(".carousel").style.backgroundColor = userData.cards[index].cardColor;
    document.querySelector("#bank-accounts").value = userData.cards[index].accountName;
})
document.querySelector(".carousel-control-prev").addEventListener("click",function(e){
    if(index  <= userData.cards.length-1 && index   >0){
        index--;
    }else{
        index = userData.cards.length-1;
    }
    document.querySelector(".carousel").style.backgroundColor = userData.cards[index].cardColor;
    document.querySelector("#bank-accounts").value = userData.cards[index].accountName;
})

document.querySelector("#btn-save-changes").addEventListener("click",function(){
    var password = document.querySelector("#current-password").value;
    var newPassword = document.querySelector("#new-password").value;
    var newPasswordRepeat = document.querySelector("#new-password-repeat").value;
    var valid = true;
    if(password || newPassword || newPasswordRepeat){
        if(password !== userData.password){
            alert("Failed to make changed current password was incorrect");
            valid = false;
        }else{
            if(newPassword !== newPasswordRepeat){
                alert("Failed to make changes password does not match");
                valid = false;
            }else{
                userData.password = newPassword;
            }
        }
    }

    if(valid){
        updateChanges();
        axios.post('/users_settings/updateChanges', {
            ...userData,
        }).then(function() {
            alert("changes saved");
        });
    }


})

function updateChanges(){
    userData.username =document.querySelector("#username").value ;
    userData.firstName= document.querySelector("#first-name").value;
    userData.lastName = document.querySelector("#last-name").value ;
    userData.phoneNumber= document.querySelector("#phone-number").value;
    userData.email = document.querySelector("#email").value;
    userData.uniName = document.querySelector("#uni-name").value;
    userData.studentID = document.querySelector("#studetn-ID").value;
}
document.addEventListener("click",function(e){
    if(e.target.classList.contains("theme-button")){
        userData.cards[index].cardColor = e.target.style.backgroundColor;
        document.querySelector(".carousel").style.backgroundColor = userData.cards[index].cardColor;
    }else if (e.target.classList.contains("avatar-elm")){
        document.querySelector('.card-body.media img').src= e.target.src;
        userData.avatarPerson = e.target.src;
    }
})
function makeCard({accountNumber,sortCode, accountName, cardNumber, expiryDate,cardColor}){
    var cardCarouselInner = document.querySelector(".carousel-inner");
    cardCarouselInner.innerHTML += `
<div class="carousel-item">
            <div class="bank-card">
              <img src="/images/logo.png" alt="logo" class="bank-card-logo">
              <div class="card__sim"></div>
              <div class="bank-card-number">
                  ${cardNumber}
              </div>
              <span class="card-number-text">card-number</span>
              <div class="bank-card-expiry">
                  <div class="bank-card-expiry-text">
                    Expiry Date
                  </div>
                  <div class="bank-card-expiry-number">
                      ${expiryDate}
                  </div>
              </div>
              <div class="bank-card-bottom">
                  <span class="mr-3">${sortCode}</span>
                  <span>${accountNumber}</span>
              </div>
              <div class="icons">
                  <i class="fab fa-cc-mastercard"></i>
                  <i class="fab fa-cc-visa"></i>
                  <i class="fab fa-apple-pay"></i>
              </div>
              <div class="account-name">
                  ${accountName}
              </div>
          </div>
</div>`;
}
