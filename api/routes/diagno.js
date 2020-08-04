const express = require('express');
const router = express.Router();
const multer = require('multer');
const crypto = require('crypto');
const mime = require('mime');
const authorize = require('../middleware/authorize');
const authonticate = require('../middleware/authenticate');
const roles = require('../middleware/roles');

const diagnoController = require('../controller/diagno');
const route = require('./diagnose');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        crypto.pseudoRandomBytes(16, function(err, raw) {
            cb(null, raw.toString('hex') + Date.now() + '.' + mime.getExtension(file.mimetype))
        });
    }
});

const uploads = multer({ storage: storage });

router.post('/', uploads.single('radioImage'), diagnoController.diagno_post);
router.get('/:diagnoID', diagnoController.diagno_get_one);
router.get('/patient/:patientID', diagnoController.diagno_get_patient);
router.get('/drug/:patientID', diagnoController.diagno_get_drug);
router.get('/radio/:patientID', diagnoController.diagno_get_radio);
router.get('/:patientID/:doctorID', diagnoController.diagno_patient_doctor);

module.exports = router;