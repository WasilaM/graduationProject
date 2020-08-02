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
// router.patch('/:diagnoseID', authorize([roles.DOCTOR]), diagnoseController.diagnose_patch);
router.get('/diagnose/patient/:patientID', authorize([roles.PATIENT]), diagnoseController.diagnose_get_patient);
// http://localhost:3000/diagnose/diagnose/patient/:patientID  => replace (:patientID) with the patient ID .
router.get('/diagnose/:diagnoseID', authorize([roles.PATIENT]), diagnoseController.diagnose_get_One);
// http://localhost:3000/diagnose/diagnose/:diagnoseID  => replace (:diagnoseID) with the diagnoseID ID .
router.get('/diagnose/doctor/:doctorID', authorize([roles.DOCTOR]), diagnoseController.diagnose_get_patient_doctor);
// http://localhost:3000/diagnose/diagnose/doctor/:doctorID => replace (:doctorID) with the doctorID ID .
router.get('/diagnose/:patientID/:doctorID', authorize([roles.PATIENT]), diagnoseController.diagnose_get_patient_doctor);
// http://localhost:3000/diagnose/diagnose/:patientID/:doctorID => replace (:doctorID) with the doctorID ID .
router.get('/diagnose/drug/:patientID', authorize([roles.PATIENT]), diagnoseController.diagnose_get_drug);
// http://localhost:3000/diagnose/diagnose/drug/:patientID => replace (:patientID) with the patientID ID .
router.get('/diagnose/radiology/:patientID', authorize([roles.PATIENT]), diagnoseController.diagnose_get_radiology);
// http://localhost:3000/diagnose/diagnose/radiology/:patientID => replace (:patientID) with the patientID ID .

module.exports = router;