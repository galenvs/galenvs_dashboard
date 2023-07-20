const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const experimentRoutes = require('./routes/Experiment-Routes');
const zipUploadRoutes = require('./routes/ZipUpload-Routes');
require('dotenv').config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
});

// Static file serving middleware for the records directory
app.use('/records', express.static('records'));

app.use('/api', experimentRoutes);
app.use('/api', zipUploadRoutes);

app.listen(process.env.PORT || 5000, () => console.log(`Server is running on port ${process.env.PORT || 5000}`));
