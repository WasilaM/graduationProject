const mongoose = require('mongoose');
const Doctor = require('../models/doctor');
const toImgUel = require('../utils/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const roles = require('../middleware/roles');
const clinic = require('../models/clinic');

exports.doctor_post_signup = async(req, res, next) => {
    console.log(req.file);
    Doctor.find({ email: req.body.email })
        .exec()
        .then(doctor => {
            if (doctor.length >= 1) {
                return res.status(409).json({
                    message: 'Mail exists'
                });
            } else {
                bcrypt.hash(req.body.password, 10, async(err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const doctor = new Doctor({
                            _id: new mongoose.Types.ObjectId(),
                            firstName: req.body.firstName,
                            middleName: req.body.middleName,
                            lastName: req.body.lastName,
                            birthDate: req.body.birthDate,
                            gender: req.body.gender,
                            nationalID: req.body.nationalID,
                            email: req.body.email,
                            password: hash,
                            job: req.body.job,
                            bio: req.body.bio,
                            speciality: req.body.speciality,
                            status: req.body.status,
                            number: req.body.number,
                            address: req.body.address,
                            government: req.body.government,
                            long: req.body.long,
                            lat: req.body.lat,
                            doctorImage: await toImgUel.toImgUrl(req.file)
                        });
                        doctor.save()
                            .then(result => {
                                console.log(result);
                                return res.status(201).json({
                                    message: 'Doctor account created',
                                    createdDoctor: {
                                        _id: result._id,
                                        firstName: result.firstName,
                                        middleName: result.middleName,
                                        lastName: result.lastName,
                                        birthDate: result.birthDate,
                                        gender: result.gender,
                                        nationalID: result.nationalID,
                                        email: result.email,
                                        job: result.job,
                                        bio: result.bio,
                                        speciality: result.speciality,
                                        status: result.status,
                                        number: result.number,
                                        address: result.address,
                                        government: result.government,
                                        long: result.lomg,
                                        lat: result.lat,
                                        request: {
                                            type: 'GET',
                                            url: 'http://localhost:3000/doctor/' + result._id
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

exports.doctor_post_login = (req, res, next) => {
    Doctor.find({ email: req.body.email }).exec()
        .then(doctor => {
            if (doctor.length < 1) {
                return res.status(404).json({
                    message: 'Auth failed'
                });
            }
            bcrypt.compare(req.body.password, doctor[0].password, (err, result) => {
                if (err) {
                    return res.status(404).json({
                        message: 'Auth failed'
                    });
                }
                if (result) {
                    const token = jwt.sign({
                            email: doctor[0].email,
                            _id: doctor[0]._id,
                            role: roles.DOCTOR
                        },
                        process.env.JWT_KEY);
                    return res.status(200).json({
                        message: 'Auth success',
                        token: token,
                        _id: doctor[0]._id
                    })
                }
                return res.status(401).json({
                    message: 'Auth failed'
                });
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                error: err
            });
        });
}

/*exports.doctor_post = async(req, res, next) => {
    console.log(req.file);
    const doctor = new Doctor({
        _id: new mongoose.Types.ObjectId(),
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        birthDate: req.body.birthDate,
        gender: req.body.gender,
        nationalID: req.body.nationalID,
        email: req.body.email,
        job: req.body.job,
        bio: req.body.bio,
        speciality: req.body.speciality,
        status: req.body.status,
        number: req.body.number,
        address: req.body.address,
        government: req.body.government,
        doctorImage: await toImgUel.toImgUrl(req.file)
    });
    doctor.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Created doctor account',
                createdDoctor: {
                    _id: result._id,
                    firstName: result.firstName,
                    middleName: result.middleName,
                    lastName: result.lastName,
                    birthDate: result.birthDate,
                    gender: result.gender,
                    nationalID: result.nationalID,
                    email: result.email,
                    job: result.job,
                    bio: result.bio,
                    speciality: result.speciality,
                    status: result.status,
                    number: result.number,
                    address: result.address,
                    government: result.government,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/doctor/' + result._id
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
}*/

exports.doctor_get_one = (req, res, next) => {
    const id = req.params.doctorID;
    Doctor.findById(id)
        .select('_id firstName middleName lastName birthDate gender nationalID' +
            'email job status number address government bio doctorImage speciality')
        .exec()
        .then(doc => {
            console.log('From database', doc)
            if (doc) {
                res.status(200).json({
                    doctor: doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/doctor/'
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

exports.doctor_patch = (req, res, next) => {
    const id = req.params.doctorID;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.proName] = ops.value;
    }
    Doctor.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Doctor account updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/doctor/' + id
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

exports.doctor_delete = (req, res, next) => {
    const id = req.params.doctorID;
    Doctor.remove({ _id: id }).exec()
        .then(result => {
            res.status(200).json({
                message: 'Doctor account deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/doctor'
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