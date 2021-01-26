const tf = require('@tensorflow/tfjs-node');

function createModel(inputShape) {
    const model = tf.sequential();
    model.add(tf.layers.dense({
        inputShape: inputShape,
        activation: 'relu',
        units: 50,
    }));

    model.compile({loss: 'categoricalCrossentropy', optimizer: 'adam', metrics: ['accuracy']});

    model.summary();

    return model;
}

module.exports = createModel;