const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const toImgUrl = require('../utils/index');
const Patient = require('../models/patient');
const bcrypt = require('bcrypt');
const roles = require('../middleware/roles');
const Doctor = require('../models/doctor');

exports.patient_post_signup = (req, res, next) => {
    console.log(req.file);
    Patient.find({ email: req.body.email })
        .exec()
        .then(patient => {
            if (patient.length >= 1) {
                return res.status(409).json({
                    statusCode: 409,
                    message: 'Mail exists'
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            statusCode: 500,
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
                                return res.status(200).json({
                                    statusCode: 200,
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
                                    statusCode: 500,
                                    message: err.message
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
                    statusCode: 404,
                    message: 'Not found'
                });
            }
            bcrypt.compare(req.body.password, patient[0].password, (err, result) => {
                if (err) {
                    return res.status(404).json({
                        statusCode: 404,
                        message: err.message
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
                        statusCode: 200,
                        message: 'Auth success',
                        token: token,
                        _id: patient[0]._id
                    });
                }
                res.status(401).json({
                    statusCode: 401,
                    message: 'Auth failed'
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                statusCode: 500,
                erppr: err.message
            });
        });
}

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
                    statusCode: 200,
                    patient: doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/patient/'
                    }
                });
            } else {
                res.status(404).json({
                    statusCode: 404,
                    message: 'Not found'
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                statusCode: 500,
                error: err.message
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

exports.patient_delete = (req, res, next) => {
    const id = req.params.patientID;
    Patient.remove({ _id: id }).exec()
        .then(result => {
            res.status(200).json({
                statusCode: 200,
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
                statusCode: 500,
                error: err.message
            });
        });
}

exports.find_doctor_name = (req, res, next) => {
    Doctor.find({ firstName: req.body.firstName })
        .exec()
        .then(result => {
            if (result) {
                return res.status(200).json({
                    statusCode: 200,
                    searchedDoctor: result
                });
            } else {
                return res.status(404).json({
                    statusCode: 404,
                    message: 'Not found'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                statusCode: 200,
                error: err.message
            });
        });
}

exports.find_doctor_speciality = (req, res, next) => {
    Doctor.find({ speciality: req.body.speciality })
        .exec()
        .then(result => {
            if (result) {
                return res.status(200).json({
                    statusCode: 200,
                    searchedDoctor: result
                });
            } else {
                return res.status(404).json({
                    statusCode: 404,
                    message: 'Not found'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                statusCode: 200,
                error: err.message
            });
        });
}

exports.find_doctor_governement = (req, res, next) => {
    Doctor.find({ government: req.body.government })
        .exec()
        .then(result => {
            if (result) {
                return res.status(200).json({
                    statusCode: 200,
                    searchedDoctor: result
                });
            } else {
                return res.status(404).json({
                    statusCode: 404,
                    message: 'Not found'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                statusCode: 200,
                error: err.message
            });
        });
}