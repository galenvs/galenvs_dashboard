const { spawn } = require('child_process');
const path = require('path'); 

const predictor = async (req, res) => {
    try {
        const inputData = req.body;

        const predictionScriptPath = path.join(process.env.PREDICTORS_DATA_PATH, 'prediction_script.py');
        const pythonProcess = spawn('python', [predictionScriptPath, JSON.stringify(inputData)]);
        
        pythonProcess.stdout.on('data', (data) => {
            res.send(data.toString()); 
        });

        // Handle Python script errors
        pythonProcess.stderr.on('data', (data) => {
            console.error(`Python Error: ${data}`);
            res.status(500).send('Internal Server Error: Error during prediction.');
        });

        // Handle child process errors
        pythonProcess.on('error', (error) => {
            console.error(`Process Error: ${error.message}`);
            res.status(500).send('Internal Server Error: Failed to start prediction process.');
        });

        // Handle exit of the python script
        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                console.error(`Python script exited with code ${code}`);
                res.status(500).send('Internal Server Error: Prediction script exited with an error.');
            }
        });

    } catch (error) {
        console.error(`Server Error: ${error.message}`);
        res.status(500).send('Internal Server Error: Unexpected error.');
    }
};

module.exports = {
    predictor
};
