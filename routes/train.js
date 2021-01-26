var express = require('express');
var router = express.Router();
const tf = require('@tensorflow/tfjs');
const createModel = require('./model');
const createDataset = require('./data');
const csvPath = './routes/machineLearning/transfers.csv';

router.get('/', function(req, res, next) {
    res.render('payment', { title: 'Payment' });
});

router.get('/run', async function(req, res, next) {
    const datasetObj = await createDataset('file://' + csvPath);
    console.log(datasetObj);
    const model = createModel([datasetObj.numOfColumns]);

//     const batchSize = 10;
//     const savePath = 'file://routes/machineLearning/trainedModel';
//
//     const trainBatches = Math.floor(50 / batchSize);
//     const dataset = datasetObj.dataset.shuffle(50).batch(batchSize);
//     const trainDataset = dataset.take(trainBatches);
//     const validationDataset = dataset.skip(trainBatches);
//
//     await model.fitDataset(trainDataset, {epochs: 10, validationData: validationDataset});
//
//     await model.save(savePath);
//
//     const loadedModel = await tf.loadLayersModel(savePath + '/model.json');
//     const result = loadedModel.predict(tf.tensor2d([20], [1, 1])).dataSync();

    // synthetic data for training
    const xs = tf.tensor2d([-1, 0, 1, 2, 3, 4], [6, 1]);
    const ys = tf.tensor2d([-3, -1, 1, 3, 5, 7], [6, 1]);

    var text = model.predict(tf.tensor2d([20], [1, 1])).dataSync();

//     var categories = ['Charity', 'Eating Out', 'Entertainment', 'General', 'Gift', 'Groceries', 'Family/Friends',
//     'Personal Care', 'Shopping', 'Transport']

//     var text = categories[prediction];

    res.send({text : text });
});

module.exports = router;