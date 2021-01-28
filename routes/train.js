var express = require('express');
var router = express.Router();
const tf = require('@tensorflow/tfjs');
const createModel = require('./model');
const createDataset = require('./data');
const csvPath = './routes/machineLearning/transfers.csv';

router.get('/', function(req, res, next) {
    res.render('payment', { title: 'Payment' });
});

// runs the machine learning prediction
router.get('/run', async function(req, res, next) {
    // calling the createDataset function from data.js
    const datasetObj = await createDataset('file://' + csvPath);

    // calling the createModel function from model.js
    const model = createModel([datasetObj.numOfColumns]);

    // synthetic data for training
    const xs = tf.tensor2d([-1, 0, 1, 2, 3, 4], [6, 1]);
    const ys = tf.tensor2d([-3, -1, 1, 3, 5, 7], [6, 1]);

    // calculating the prediction
    var prediction = model.predict(tf.tensor2d([20], [1, 1])).toInt().dataSync();

    var categories = ['Charity', 'Eating Out', 'Entertainment', 'General', 'Gift', 'Groceries', 'Family/Friends',
    'Personal Care', 'Shopping', 'Transport']

    // mapping the prediction to its spending category
    var text = categories[prediction[0]];

    res.send({text : text });
});

module.exports = router;