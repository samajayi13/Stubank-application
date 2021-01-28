const tf = require('@tensorflow/tfjs');

// creates and compiles the machine learning model
function createModel(inputShape) {
    // creates model where layers can be stacked
    const model = tf.sequential();
    // adding a layer instance to the model stack
    model.add(tf.layers.dense({
        inputShape: inputShape,
        activation: 'relu',
        units: 50,
    }));

    // compiling the model
    model.compile({loss: 'categoricalCrossentropy', optimizer: 'adam', metrics: ['accuracy']});

    // shows model summary in terminal
    model.summary();

    return model;
}

module.exports = createModel;