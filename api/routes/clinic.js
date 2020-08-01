const express = require('express');
const router = express.Router();

const clinicController = require('../controller/clinic');

const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const roles = require('../middleware/roles');

router.get('/:clinicID', clinicController.clinic_get_one);

router.use(authenticate);
router.use(authorize([roles.ADMIN]));

router.post('/', clinicController.clinic_post);

router.patch('/:clinicID', clinicController.clinic_patch);

router.delete('/:clinicID', clinicController.clinic_delete);

module.exports = router;