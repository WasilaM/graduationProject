const express = require('express');
const router = express.Router();

const appointController = require('../controller/appoint');

const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const roles = require('../middleware/roles');

router.post('/', appointController.appoint_post);
router.get('/', appointController.appoint_get_all);
router.get('/:appointID', appointController.appoint_get_one_appoint);
router.get('/appoint-clinic/:clinicID', appointController.appoint_get_clinic);

router.use(authenticate);

router.get('/appoint-patient/:patientID', authorize([roles.PATIENT]), appointController.appoint_get_patient);

router.get('/appoint-doctor/:doctorID', authorize([roles.DOCTOR]), appointController.appoint_get_doctor);

router.patch('/appoint-doctor/:doctorID', authorize([roles.DOCTOR]), appointController.appoint_patch_doctor);

router.patch('/appoint-patient/:patientID', authorize([roles.PATIENT]), appointController.appoint_patch_patient);

router.delete('/appoint-doctor/:doctorID', authorize([roles.DOCTOR]), appointController.appoint_delete_doctor);

router.delete('/appoint-patient/:patientID', authorize([roles.PATIENT]), appointController.appoint_delete_patient);

module.exports = router;