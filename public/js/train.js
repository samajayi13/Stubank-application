function run() {
    axios.get('/train/run', {
        //the parameters that is sent with the request
    })
        .then(function(response) {
              document.getElementById('micro-out-div').innerText  = response.data.text[0]
        })
        .catch(function(error) {
            console.log(error);
        })
}

// function displayPrediction(){
//     document.querySelector("#micro-out-div").innerText = model.predict(tf.tensor2d([20], [1, 1])).dataSync();
// }

run();