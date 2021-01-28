var DEFAULT_DATASET_SIZE = 7,
    addedCount = 0,
    color = Chart.helpers.color;
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(231,233,237)'
};

function makeBarData(){
    return {
        labels: ["January", "February", "March", "April", "May", "June", "July","August","September","October","November","December"],
            datasets: [{
        label: 'Actual Savings',
        backgroundColor: color(chartColors.green).alpha(0.5).rgbString(),
        borderColor: chartColors.red,
        borderWidth: 1,
        data: [
            getActualSavingNumber(1),
            getActualSavingNumber(2),
            getActualSavingNumber(3),
            getActualSavingNumber(4),
            getActualSavingNumber(5),
            getActualSavingNumber(6),
            getActualSavingNumber(7),
            getActualSavingNumber(8),
            getActualSavingNumber(9),
            getActualSavingNumber(10),
            getActualSavingNumber(11),
            getActualSavingNumber(12)
        ]
    }, {
        label: 'Savings Goal',
        backgroundColor: color(chartColors.blue).alpha(0.5).rgbString(),
        borderColor: chartColors.blue,
        borderWidth: 1,
        data: [
            getActualGoalNumber(1),
            getActualGoalNumber(2),
            getActualGoalNumber(3),
            getActualGoalNumber(4),
            getActualGoalNumber(5),
            getActualGoalNumber(6),
            getActualGoalNumber(7),
            getActualGoalNumber(8),
            getActualGoalNumber(9),
            getActualGoalNumber(10),
            getActualGoalNumber(11),
            getActualGoalNumber(12)
        ]
    }]
    };
}


var svg ;
function drawProgress(end){
    d3.select("svg").remove()
    if(svg){
        svg.selectAll("*").remove();
    }
    var wrapper = document.getElementById('radialprogress');
    var start = 0;
    var colours = {
        fill: '#2d7de9',
        track: '#555555',
        text: '#00C0FF',
        stroke: '#FFFFFF',
    }
    var radius = 80;
    var border = 20;
    var strokeSpacing = 4;
    var endAngle = Math.PI * 2;
    var formatText = d3.format('.0%');
    var boxSize = radius * 2;
    var count = end;
    var progress = start;
    var step = end < start ? -0.01 : 0.01;
    //Define the circle
    var circle = d3.svg.arc()
        .startAngle(0)
        .innerRadius(radius)
        .outerRadius(radius - border);
    //setup SVG wrapper
    svg = d3.select(wrapper)
        .append('svg')
        .attr('width', boxSize)
        .attr('height', boxSize);
    // ADD Group container
    var g = svg.append('g')
        .attr('transform', 'translate(' + boxSize / 2 + ',' + boxSize / 2 + ')');
    //Setup track
    var track = g.append('g').attr('class', 'radial-progress');
    track.append('path')
        .attr('fill', colours.track)
        .attr('stroke', colours.stroke)
        .attr('stroke-width', strokeSpacing + 'px')
        .attr('d', circle.endAngle(endAngle));
    //Add colour fill
    var value = track.append('path')
        .attr('fill', colours.fill)
        .attr('stroke', colours.stroke)
        .attr('stroke-width', strokeSpacing + 'px');
    //Add text value
    var numberText = track.append('text')
        .attr('fill', colours.text)
        .attr('text-anchor', 'middle')
        .attr('dy', '.5rem');
    //update position of endAngle
    value.attr('d', circle.endAngle(endAngle * end));
    //update text value
    numberText.text(formatText(end));
}



var userID = null;
var usersGoals = {};
getSession();
function getSession(){
    axios.get('/session/getSession', {
    }).then(function(response) {
        userID = response.data.result.customerID;
        getCurrentAmountInPot();
        getSavingsGoalsValues();
        getActualSavingsMade();
        getPieChartData();
    })

}

var currentBalance = null;

function getCurrentAmountInPot(){
    axios.get('/savingspot/getCurrentAmountInPot', {
        params :{
            userID : userID
        }
    }).then(function(response) {
        currentBalance = response.data.result[0].Current_Balance;
        currentBalance = currentBalance.toString().indexOf(".") === currentBalance.toString().length-2
                        ? currentBalance + "0"
                        : currentBalance;
        document.querySelector("#current-balance").innerText = currentBalance;
    })
}

function getSavingsGoalsValues(){
    axios.get('/savingspot/getSavingsGoalsValues', {
        params :{
            userID : userID
        }
    }).then(function(response) {
        usersGoals = {...response.data.result[0]};
        var i = 0;
        Object.keys(usersGoals).forEach(function(x){

            if(document.querySelector(`#${x}`)){
                document.querySelector(`#${x}`).value = Object.values(usersGoals)[i];
            }
            i++;
        })
    })
}

document.querySelector(".btn-update-goals").addEventListener("click",function(e){
    Object.keys(usersGoals).forEach(function(x){
        if(document.querySelector(`#${x}`)){
            usersGoals[`${x}`] = document.querySelector(`#${x}`).value;
        }
    });
    axios.post('/savingspot/updateSavingsGoalsValues', {
            userID : userID,
            goals : usersGoals
    }).then(function(response) {
        alert("Saving goals updated");
        window.location.href = "http://localhost:3000/savingspot";
    })
})
var savingsMade = null;
function getActualSavingsMade(){
    axios.get('/savingspot/getActualSavings', {
       params :{
           userID : userID
       }
    }).then(function(response) {
        savingsMade = response.data.result[1];
        makeBarGraph();
    })
}

function makeBarGraph(){
    var barData = makeBarData();
    var index = 11;
    var ctx = document.getElementById("barChart").getContext("2d");
    var	myNewChartB = new Chart(ctx, {
        type: 'bar',
        data: barData,
        options: {
            responsive: true,
            maintainAspectRation: true,
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Bar Chart'
            }
        }
    });
}
function getActualSavingNumber(month ){
    if((month-1) <= savingsMade.length-1 ){
        return savingsMade[month-1].SUM;
    }else{
        return 0;
    }
}

function getActualGoalNumber(month){
    var userGoals = document.getElementsByTagName("input");
    return userGoals[month-1].value;
}

function getTotalSavingsGoal(){
    var userGoals = document.getElementsByTagName("input");
    var sum = 0.00;
    for(var i = 0; i<= 11;i++){
        sum += parseFloat(userGoals[i].value);
    }
    return sum;
}

function getPieChartData(){
    axios.get('/savingspot/getSavingCategory', {
        params :{
            userID : userID
        }
    }).then(function(response) {
        let dataArr = response.data.result[1];
        var dataObj = dataArr.reduce(function(a,x){
            a[`${x.Transfer_Description}`] = x.total;
            return a;
        },{});
        makePieChart(dataObj);
        drawProgress(currentBalance/getTotalSavingsGoal());
    })
}
function makePieChart(dataObj){
    var oilCanvas = document.getElementById("oilChart");
    Chart.defaults.global.defaultFontFamily = "Lato";
    Chart.defaults.global.defaultFontSize = 18;
    let labels = ["General",
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
    var i = 0;

   var data =  labels.reduce(function(accum,x){
       if(Object.keys(dataObj).includes(x)){
           accum[i] = dataObj[`${x}`];
       }else{
           accum[i] = 0;
       }
       i++;
       return accum;
    },[]);

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