const express = require('express');
const router = express.Router();
const multer = require('multer');
const crypto = require('crypto');
const mime = require('mime');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const roles = require('../middleware/roles');

const doctorController = require('../controller/doctor');

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

router.post('/login', doctorController.doctor_post_login);
router.get('/:doctorID', doctorController.doctor_get_one);

router.use(authenticate);

router.patch('/:doctorID', authorize([roles.DOCTOR]), doctorController.doctor_patch);
router.post('/signup', authorize([roles.ADMIN]), uploads.single('doctorImage'), doctorController.doctor_post_signup);
router.delete('/:doctorID', authorize([roles.ADMIN]), doctorController.doctor_delete);


module.exports = router;