const tf = require('@tensorflow/tfjs-node');

async function createDataset(csvPath) {
  const dataset = tf.data.csv(csvPath, {hasHeader: true, columnConfigs: {'Category': {isLabel: true}}});
  const numOfColumns = (await dataset.columnNames()).length - 1;
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