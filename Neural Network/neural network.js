const tf = require('@tensorflow/tfjs');
const csv = require('csv-parser');
const fs = require('fs');

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};
// Load and process data
const results = [];
fs.createReadStream('wine_data.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
        const inputFeatures = [
            'citric_acid', 'residual_sugar',
            'chlorides', 'free_sulfur_dioxide',
            'sulphates', 'alcohol'
        ];
        
        const processedData = results.map(row => ({
            inputs: inputFeatures.map(feature => parseFloat(row[feature])),
            target: parseInt(row.quality) >= 6 ? 1 : 0
        }));

        // Convert to tensors
        const xs = tf.tensor2d(processedData.map(d => d.inputs));
        const ys = tf.tensor2d(processedData.map(d => [d.target]));

        // Define model
        const model = tf.sequential();
        model.add(tf.layers.dense({ inputShape: [inputFeatures.length], units: 5, activation: 'relu' }));
        model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

        // Compile model
        model.compile({ optimizer: 'adam', loss: 'binaryCrossentropy', metrics: ['accuracy'] });

        // Train model
        console.log('Training model...');
        await model.fit(xs, ys, { epochs: 50, batchSize: 8 });
        console.log('Training completed!');

        // Make predictions
        ringe = 0
        one = 0
        processedData.slice(0, results.length).forEach((data, index) => {
            const inputTensor = tf.tensor2d([data.inputs]);
            const prediction = model.predict(inputTensor).dataSync()[0];
            console.log(`Sample ${index + 1}: Prediction = ${prediction >= 0.5 ? 1 : 0}, Actual = ${data.target}`);
            if(prediction >= 0.5 ? 1 : 0 === data.target){
                ringe += 1
            }
            if(data.target === 0){
                one += 1
            }
        });

        console.log(`ringe ${ringe} out of ${results.length}`)
        console.log(`1 = ${one} 0 = ${results.length - one}`)
    });


