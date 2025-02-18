const csv = require('csv-parser');
const fs = require('fs');

class Perceptron {
    constructor(inputNodes, learningRate = 0.1) {
        this.inputNodes = inputNodes;
        this.learningRate = learningRate;
        this.weights = new Array(inputNodes).fill(0).map(() => Math.random() * 2 - 1);
        this.bias = Math.random() * 2 - 1;
    }

    activation(x) {
        return x >= 0 ? 1 : 0;
    }

    predict(inputArray) {
        if (!inputArray || inputArray.length !== this.inputNodes) {
            throw new Error(`Expected ${this.inputNodes} inputs, got ${inputArray?.length}`);
        }
        let sum = inputArray.reduce((acc, val, i) => acc + val * this.weights[i], this.bias);
        return this.activation(sum);
    }

    train(inputArray, target) {
        let prediction = this.predict(inputArray);
        let error = target - prediction;
        
        // console.table({
        //     Inputs: inputArray,
        //     Prediction: prediction,
        //     Target: target,
        //     Error: error,
        //     Weights: this.weights,
        //     Bias: this.bias
        // });
        
        this.weights = this.weights.map((w, i) => w + this.learningRate * error * inputArray[i]);
        this.bias += this.learningRate * error;
    }

    
}

// Process wine data
const results = [];
fs.createReadStream('wine_data.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
        // Convert quality scores to binary classification
        // Let's say quality >= 6 is "good" (1) and < 6 is "not good" (0)
        const processedData = results.map(row => ({
            inputs: [
                parseFloat(row.fixed_acidity),
                parseFloat(row.volatile_acidity),
                parseFloat(row.citric_acid),
                parseFloat(row.residual_sugar),
                parseFloat(row.chlorides),
                parseFloat(row.free_sulfur_dioxide),
                parseFloat(row.total_sulfur_dioxide),
                parseFloat(row.density),
                parseFloat(row.pH),
                parseFloat(row.sulphates),
                parseFloat(row.alcohol)
            ],
            target: parseInt(row.quality) >= 6 ? 1 : 0
        }));

        // Create perceptron with 11 input nodes (one for each feature)
        const perceptron = new Perceptron(11, 0.03);

        // Train the perceptron
        console.log('Starting training...');
        for (let epoch = 1; epoch <= 100; epoch++) {
            let epochError = 0;
            processedData.forEach(data => {
                let prediction = perceptron.predict(data.inputs);
                epochError += Math.abs(data.target - prediction);
                perceptron.train(data.inputs, data.target);
            });

            // Log progress every 10 epochs
            if (epoch % 10 === 0) {
                console.log(`Epoch ${epoch}, Total Error: ${epochError}`);
            }
        }

        // Test the perceptron with a sample input
        const sampleWine = processedData[0].inputs;
        const prediction = perceptron.predict(sampleWine);
        console.log('Sample prediction:', prediction);

    });