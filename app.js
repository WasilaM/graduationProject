const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const comperssion = require('compression');
require('express-async-errors');
const cors = require('cors');

const patientRoute = require('./api/routes/patient');
const doctorRoute = require('./api/routes/doctor');
const clinicRoute = require('./api/routes/clinic');
const appointRoute = require('./api/routes/appoint');
const adminRoute = require('./api/routes/admin');
const diagnoRoute = require('./api/routes/diagno');

mongoose.connect(
        "mongodb+srv://GraduationProject:" +
        "GraduationProject" +
        "@graduationproject-p09hn.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => console.log('connect to DB'));

app.use(morgan('dev'));

app.use(express.static('patientUploads'));
app.use(cors());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin", "X-Requested-With", "Content-Type", "Authorization");
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, PATCH, POST, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use(helmet());
app.use(comperssion());

app.use('/patient', patientRoute);
app.use('/doctor', doctorRoute);
app.use('/clinic', clinicRoute);
app.use('/appoint', appointRoute);
app.use('/admin', adminRoute);
app.use('/diagno', diagnoRoute);

module.exports = app;