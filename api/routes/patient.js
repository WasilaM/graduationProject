const express = require('express');
const router = express.Router();
const multer = require('multer');
const crypto = require('crypto');
const mime = require('mime');

const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const roles = require('../middleware/roles');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads');
    },
    filename: function(req, file, cb) {
        /*crypto.pseudoRandomBytes(16, function(err, raw) {
            cb(null, raw.toString('hex') + Date.now() + '.' + mime.getExtension(file.mimetype));
        });*/
        cb(null, new Date().toISOString + '-' + file.originalname);
    }
});

const uploads = multer({ storage: storage });

const patientController = require('../controller/patient.js');

router.post('/signup', patientController.patient_post_signup);

router.post('/login', patientController.patient_post_login);

router.use(authenticate);
router.use(authorize([roles.PATIENT]));

router.get('/:patientID', patientController.patient_get_one);

router.patch('/:patientID', uploads.single('patientImage'), patientController.patient_patch);

router.delete('/:patientID', patientController.patient_delete);

router.post('/doctor', patientController.find_doctor);

module.exports = router;