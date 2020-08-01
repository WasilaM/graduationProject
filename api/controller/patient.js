const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const toImgUrl = require('../utils/index');
const Patient = require('../models/patient');
const bcrypt = require('bcrypt');
const roles = require('../middleware/roles');

exports.patient_post_signup = (req, res, next) => {
    console.log(req.file);
    Patient.find({ email: req.body.email })
        .exec()
        .then(patient => {
            if (patient.length >= 1) {
                return res.status(409).json({
                    message: 'Mail exists'
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const patient = new Patient({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash,
                            nationalID: req.body.nationalID
                        });
                        patient.save()
                            .then(result => {
                                console.log(result);
                                return res.status(201).json({
                                    message: 'Patient account created',
                                    createdPatient: {
                                        id: result._id,
                                        email: result.email,
                                        nationalID: result.nationalID,
                                        request: {
                                            type: 'GET',
                                            url: 'http://localhost:3000/patient/' + result._id
                                        }
                                    }
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                return res.status(500).json({
                                    error: err
                                });
                            });
                    }
                })
            }
        })
}

exports.patient_post_login = (req, res, next) => {
    Patient.find({ email: req.body.email }).exec()
        .then(patient => {
            if (patient.length < 1) {
                return res.status(404).json({
                    message: 'Auth failed'
                });
            }
            bcrypt.compare(req.body.password, patient[0].password, (err, result) => {
                if (err) {
                    return res.status(404).json({
                        message: 'Auth failed'
                    });
                }
                if (result) {
                    const token = jwt.sign({
                            email: patient[0].email,
                            _id: patient[0]._id,
                            role: roles.PATIENT
                        },
                        process.env.JWT_KEY);
                    return res.status(200).json({
                        message: 'Auth success',
                        token: token,
                        _id: patient[0]._id
                    });
                }
                res.status(401).json({
                    message: 'Auth failed'
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

/* exports.patient_post = async(req, res, next) => {
    console.log(req.file);
    const patient = new Patient({
        _id: new mongoose.Types.ObjectId(),
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        birthDate: req.body.birthDate,
        gender: req.body.gender,
        nationalID: req.body.nationalID,
        email: req.body.email,
        job: req.body.job,
        status: req.body.status,
        number: req.body.number,
        address: req.body.address,
        government: req.body.government,
        patientImage: await toImgUrl.toImgUrl(req.file)
    });
    patient.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Patient account created',
                createdPatient: {
                    id: result._id,
                    firstName: result.firstName,
                    middleName: result.middleName,
                    lastName: result.lastName,
                    birthDate: result.birthDate,
                    gender: result.gender,
                    nationalID: result.nationalID,
                    email: result.email,
                    job: result.job,
                    status: result.status,
                    number: result.number,
                    address: result.address,
                    government: result.government,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/patient/' + result._id
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
 */

exports.patient_get_one = (req, res, next) => {
    const id = req.params.patientID;
    Patient.findById(id)
        .select('_id firstName middleName lastName birthDate gender nationalID' +
            'email job status number address government patientImage')
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({
                    patient: doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/patient/'
                    }
                });
            } else {
                res.status(404).json({
                    message: 'Not found'
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.patient_patch = async(req, res, next) => {
    try {
        let id = req.params.patientID;
        let old = await Patient.findById(id);
        if (!old)
            return res.status(404).end();
        if (req.file)
            req.body.patientImage = await toImgUrl.toImgUrl(req.file);
        let newDoc = await Patient.findByIdAndUpdate(id, req.body, { new: true });
        return res.status(200).json(newDoc);
    } catch (error) {
        next(error)
    }
};


/*exports.patient_patch = async(req, res, next) => {
    const id = req.params.patientID;
    const updateOps = {};
    if (req.files['patientImagr']) {
        req.body.patientImage = await toImgurl
    } 
    /*Patient.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Patient account updated',
                request: {
                    type: 'Get',
                    url: 'http://localhost:3000/patient/' + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });*/

exports.patient_delete = (req, res, next) => {
    const id = req.params.patientID;
    Patient.remove({ _id: id }).exec()
        .then(result => {
            res.status(200).json({
                message: 'Patient account deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/patient'
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}