getSession();

function getSession(){
    axios.get('/session/getSession', {
    }).then(function(response) {
        console.log(response);
    })

}