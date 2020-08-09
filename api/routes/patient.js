const express = require('express');
const router = express.Router();
const multer = require('multer');

const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const roles = require('../middleware/roles');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString + '-' + file.originalname);
    }
});

const uploads = multer({ storage: storage });

const patientController = require('../controller/patient.js');

router.post('/signup', patientController.patient_post_signup);
router.post('/login', patientController.patient_post_login);
router.get('/search/:patientID', patientController.patient_get_one);

router.use(authenticate);
router.use(authorize([roles.PATIENT]));

router.get('/:patientID', patientController.patient_get_one);
router.patch('/:patientID', uploads.single('patientImage'), patientController.patient_patch);
router.delete('/:patientID', patientController.patient_delete);
router.post('/name/doctor', patientController.find_doctor_name);
router.post('/speciality/doctor', patientController.find_doctor_speciality);
router.post('/govern/doctor', patientController.find_doctor_governement);

module.exports = router;