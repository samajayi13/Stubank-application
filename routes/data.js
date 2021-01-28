const tf = require('@tensorflow/tfjs');

// creates a dataset for machine learning from a given CSV file
async function createDataset(csvPath) {
  // uses tensorflow function to access columns of given CSV file
  const dataset = tf.data.csv(csvPath, {hasHeader: true, columnConfigs: {'Category': {isLabel: true}}});
  // sets the numOfColumns to one less
  const numOfColumns = (await dataset.columnNames()).length - 1;
  // returns the dataset of features to labels and numOfColumns - doesn't function correctly - explained in test tables
  return {
        dataset: dataset.map(row => {
        const rawFeatures = row['xs'];
        const rawLabel = row['ys'];
        const convertedFeatures = Object.keys(rawFeatures).map(key => {
            switch (rawFeatures[key]) {
                default:
                    return Number(rawFeatures[key]);
            }
      });
      const convertedLabel = [rawLabel['Category']];
      return {xs: convertedFeatures, ys: convertedLabel};
    }),
    numOfColumns: numOfColumns
  };
}

module.exports = createDataset;