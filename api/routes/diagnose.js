const express = require('express');
const multer = require('multer');
const router = express.Router();
const crypto = require('crypto');
const mime = require('mime');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const roles = require('../middleware/roles');

const diagnoseController = require('../controller/diagnose');

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

router.use(authenticate);

router.post('/', authorize([roles.DOCTOR]), uploads.single('radioImage'), diagnoseController.diagnose_post);
router.get('/diagnose/patient/:patientID', authorize([roles.PATIENT]), diagnoseController.diagnose_get_patient);
router.get('/diagnose/:diagnoseID', authorize([roles.PATIENT]), diagnoseController.diagnose_get_One);
router.get('/diagnose/doctor/:doctorID', authorize([roles.DOCTOR]), diagnoseController.diagnose_get_patient_doctor);
router.get('/diagnose/:patientID/:doctorID', authorize([roles.PATIENT]), diagnoseController.diagnose_get_patient_doctor);
router.get('/diagnose/drug/:patientID', authorize([roles.PATIENT]), diagnoseController.diagnose_get_drug);
router.get('/diagnose/radiology/:patientID', authorize([roles.PATIENT]), diagnoseController.diagnose_get_radiology);

module.exports = router;