const mongoose = require('mongoose');

const Appoint = require('../models/appoint');

exports.appoint_post = (req, res, next) => {
    const appoint = new Appoint({
        _id: new mongoose.Types.ObjectId(),
        appointStart: req.body.appointStart,
        appointEnd: req.body.appointEnd,
        appointDate: req.body.appointDate,
        appointStatus: req.body.appointStatus,
        doctorID: req.body.doctorID,
        patientID: req.body.patientID,
        clinicID: req.body.clinicID
    })
    appoint.save()
        .then(result => {
            console.log(result);
            return res.status(200).json({
                statusCode: 200,
                message: 'Appointement created',
                createdAppoint: {
                    _id: result._id,
                    appointStart: result.appointStart,
                    appointEnd: result.appointEnd,
                    appointDate: result.appointDate,
                    appointStatus: result.appointStatus,
                    doctorID: result.doctorID,
                    patientID: result.patientID,
                    clinicID: result.clinicID
                }
            })
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                statusCode: 500,
                error: err.message
            })
        });
}

exports.appoint_get_all = (req, res, next) => {
    Appoint.find()
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                statusCode: 200,
                appoint: result.map(result => {
                    return {
                        _id: result._id,
                        appointStart: result.appointStart,
                        appointEnd: result.appointEnd,
                        appointDate: result.appointDate,
                        appointStatus: result.appointStatus,
                        doctorID: result.doctorID,
                        patientID: result.patientID,
                        clinicID: result.clinicID
                    }
                })
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

exports.appoint_get_one_appoint = (req, res, next) => {
    const id = req.params.appointID;
    Appoint.findById(id)
        .exec()
        .then(result => {
            console.log('From database', result);
            if (result) {
                res.status(200).json({
                    statusCode: 200,
                    appoint: result
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

exports.appoint_get_patient = (req, res, next) => {
    const id = req.params.patientID;
    Appoint.find({ patientID: id })
        .exec()
        .then(result => {
            console.log('From database', result);
            if (result) {
                res.status(200).json({
                    statusCode: 200,
                    patient: result
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

exports.appoint_get_doctor = (req, res, next) => {
    const id = req.params.doctorID;
    Appoint.find({ doctorID: id })
        .exec()
        .then(result => {
            console.log("From database", result);
            if (result) {
                res.status(200).json({
                    statusCode: 200,
                    Doctor: result
                });
            } else {
                res.status(404).json({
                    statusCode: 404,
                    message: 'Not found'
                });
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

exports.appoint_get_clinic = (req, res, next) => {
    const id = req.params.clinicID;
    Appoint.find({ clinicID: id })
        .exec()
        .then(result => {
            console.log("From database", result);
            if (result) {
                res.status(200).json({
                    statusCode: 200,
                    clinic: result
                });
            } else {
                res.status(404).json({
                    statusCode: 404,
                    message: 'Not found'
                });
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

exports.appoint_patch_doctor = (req, res, next) => {
    const id = req.params.doctorID;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.proName] = ops.value;
    }
    Appoint.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                statusCode: 200,
                message: 'Appoint updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/appoint/' + id
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

exports.appoint_patch_patient = (req, res, next) => {
    const id = req.params.patientID;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.proName] = ops.value;
    }
    Appoint.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                statusCode: 200,
                message: 'Appoint updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/appoint/' + id
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

exports.appoint_delete_doctor = (req, res, next) => {
    const id = req.params.doctorID;
    Appoint.remove({ _id: id }).exec()
        .then(result => {
            res.status(200).json({
                statusCode: 200,
                message: 'Appoint deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/doctor'
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                statusCode: 500,
                error: err
            });
        });
}

exports.appoint_delete_patient = (req, res, next) => {
    const id = req.params.patientID;
    Appoint.remove({ _id: id }).exec()
        .then(result => {
            res.status(200).json({
                statusCode: 200,
                message: 'Appoint deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/doctor'
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