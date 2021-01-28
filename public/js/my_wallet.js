var oilCanvas = document.getElementById("oilChart");
var oilCanvas1 = document.getElementById("oilChart1");
Chart.defaults.global.defaultFontFamily = "Lato";
Chart.defaults.global.defaultFontSize = 18;
var oilData = {
    labels: [
        "Saudi Arabia",
        "Russia",
        "Iraq",
        "United Arab Emirates",
        "Canada"
    ],
    datasets: [
        {
            data: [133.3, 86.2, 52.2, 51.2, 50.2],
            backgroundColor: [
                "#FF6384",
                "#63FF84",
                "#84FF63",
                "#8463FF",
                "#6384FF"
            ]
        }]
};

function makeSpendingPerCategory(data,labels){
    var oilData = {
        labels: labels,
        datasets: [
            {
                data: data,
                backgroundColor: [
                    "#FF6384",
                    "#63FF84",
                    "#84FF63",
                    "#8463FF",
                    "#6384FF",
                    "#e82e69",
                    "#2ee1e8",
                    "#d52ee8",
                    "#d8e82e",
                    "#e8812e",
                    "#2e75e8",
                    "#59e82e",
                    "#bc2ee8",
                    "#e82e2e"

                ]
            }]
    };
    var pieChart1 = new Chart(oilCanvas1, {
        type: 'pie',
        data: oilData
    });
}

function makeIncomeByAccount(data,labels){
    var oilData = {
        labels: labels,
        datasets: [
            {
                data: data,
                backgroundColor: [
                    "#FF6384",
                    "#63FF84",
                    "#84FF63",
                    "#8463FF",
                    "#6384FF",
                    "#e82e69",
                    "#2ee1e8",
                    "#d52ee8",
                    "#d8e82e",
                    "#e8812e",
                    "#2e75e8",
                    "#59e82e",
                    "#bc2ee8",
                    "#e82e2e"

                ]
            }]
    };
    var pieChart = new Chart(oilCanvas, {
        type: 'pie',
        data: oilData
    });
}
//line chart :
function createLineChart(dataArr){
    var ctx = document.getElementById("myChart");
    var data = {
        labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        datasets: [
            {
                label: "Spending For The Week",
                fill: false,
                lineTension: 0.1,
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: dataArr,
            }
        ]
    };
    var myLineChart = new Chart(ctx, {
        type: 'line',
        data: data,
    });
}

//line chart

getSession();

var userID = null;
// fetches session data for login user and gets their accounts
function getSession() {
    axios.get('/session/getSession', {}).then(function (response) {
        userID = response.data.result.customerID;
        getTotalSpentToday();
        getSpendingPerDay();
        getSpendingPerCategory();
        getIncomePerAccount();
    })
}

function getTotalSpentToday(){
    axios.get('/my_wallet/getTotalSpentToday', {
        params : {
            userID : userID
        }
    }).then(function (response) {
        if(response.data.results[0]){
            document.querySelector("#figure").innerText = " £" + response.data.results[0].SUM;
        }
    })

}
function getSpendingPerDay(){
    console.log(userID);
    axios.get('/my_wallet/getSpendingPerDay', {
        params : {
            userID : userID
        }
    }).then(function (response) {
        var dataArr = response.data.results;
        var daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        var i = 0 ;
        var dataObj = [];
       for(var i = 0; i<= 6;i++){
           for(var j = 0; j <= dataArr.length-1;j++){
               if(dataArr[j].Day === daysOfWeek[i]){
                   dataObj[i] = dataArr[j].Sum;
               }
           }
           if(!dataObj[i]){
               dataObj[i] = 0;
           }
       }
        createLineChart(dataObj);
    });
}
function getSpendingPerCategory(){
    console.log(userID);
    axios.get('/my_wallet/getSpendingPerCategory', {
        params : {
            userID : userID
        }
    }).then(function (response) {
        var dataArr = response.data.results;
        var categories = ["General",
            "Family/Friends",
            "Groceries",
            "Shopping",
            "Bills",
            "Eating Out",
            "Entertainment",
            "Finances",
            "Transport",
            "Gift",
            "Holidays",
            "Personal care",
            "Charity"];
        var i = 0 ;
        var dataObj = [];
        console.log(dataArr);
       for(var i = 0; i<= categories.length-1;i++){
           for(var j = 0; j <= dataArr.length-1;j++){
               if(dataArr[j].Category === categories[i]){
                   dataObj[i] = dataArr[j].Sum;
               }
           }
           if(!dataObj[i]){
               dataObj[i] = 0;
           }
       }
        makeSpendingPerCategory(dataObj,categories);
    });
}
function getIncomePerAccount(){
    axios.get('/my_wallet/getIncomePerAccount', {
        params : {
            userID : userID
        }
    }).then(function (response) {
        var dataArr = response.data.results;
        console.log(dataArr);
        var labels = []
        var values = []
        dataArr.forEach(function(x,i){
            labels[i] = x.Account_Name;
            values[i] = x.Sum;
        });
        console.log(labels);
        console.log(values);
        makeIncomeByAccount(values,labels);
    });
}