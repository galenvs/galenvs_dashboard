const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const ReportGeneratorFileRoutes = require('./routes/ReportGenerator-File-Routes');
const ReportGeneratorZipRoutes = require('./routes/ReportGenerator-Zip-Routes');
const recordsRoutes = require('./routes/Record-Routes');
const filterRoutes = require('./routes/Filter-Routes');
const pathogenMLRouter = require("./routes/PathogenML-Routes");

require('dotenv').config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to MongoDB');
});

// Static file serving middleware for the records directory
app.use('/records', express.static('records'));

app.use('/api', ReportGeneratorFileRoutes);
app.use('/api', ReportGeneratorZipRoutes);
app.use('/api/records', recordsRoutes);
app.use('/api/filter', filterRoutes);
app.use('/api', pathogenMLRouter);

app.listen(process.env.PORT || 5000, () => console.log(`Server is running on port ${process.env.PORT || 5000}`));