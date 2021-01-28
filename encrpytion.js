var CryptoJS = require("crypto-js");
var key = 'sfsdfsdf44242sdfds34224dfsfsf34324gdfgdfgd3sdfsdfsdf23sfsdfsdfsdfsffg23@sdf@@!£"$%^&*&fg££$%££@@%$$%£$%"$%fd';
let db = require('./dbconnection');
const mysql = require("mysql");


var encryptObj =  {
    encryptData : function(data){
        if(typeof data === "string"){
            console.log(JSON.stringify({ data}));
            var ciphertext = CryptoJS.AES.encrypt( data, key,CryptoJS.mode.ECB);
            ciphertext = ciphertext.toString();
            var ciphertext = ciphertext.replace(/\+/g,'p1L2u3S').replace(/\//g,'s1L2a3S4h').replace(/=/g,'e1Q2u3A4l').replace(/'/g,'k1B1j2S4k');
            return ciphertext
        }else{
            return data;
        }
    },
    decryptData :  function (ciphertext){
        if(typeof ciphertext === "string"){
            if(isInteger(ciphertext)){
                return ciphertext;
            }
            ciphertext = ciphertext.replace(/p1L2u3S/g, '+' ).replace(/s1L2a3S4h/g, '/').replace(/e1Q2u3A4l/g, '=').replace(/k1B1j2S4k/g,'\'');
            var bytes = CryptoJS.AES.decrypt(ciphertext, key);
            var plaintext = bytes.toString(CryptoJS.enc.Utf8);
            console.log(plaintext);
            if(plaintext.trim() === ""){
                return ciphertext;
            }
            return plaintext;
        }else{
            return ciphertext;
        }
    },
    decryptObject: function (obj){
        var that = this;
        var returnObj = {}
        Object.values(obj).forEach(function(x,i){
            if (Object.keys(obj)[i] == "Cvv_Number" || Object.keys(obj)[i] == "Card_Number" || Object.keys(obj)[i] == "Email" || Object.keys(obj)[i] == "Username" || Object.keys(obj)[i] == "Password"){
                returnObj[`${Object.keys(obj)[i]}`] = that.decryptData(x);
            }else{
                returnObj[`${Object.keys(obj)[i]}`] = x;
            }
        })
        return returnObj;
    },
    decryptResults: function (results){
        for(var i = 0; i<= results.length-1;i++){
            results[i] = encryptObj.decryptObject(results[i])
        }
        return results;
    }

}

function isInteger(value) {
    return /^\d+$/.test(value);
}

module.exports = encryptObj;