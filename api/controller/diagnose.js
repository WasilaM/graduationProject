const mongoose = require('mongoose');
const Doctor = require('../models/doctor');
const Patient = require('../models/patient');
const toImgUrl = require('../utils/index');
const jwt = require('jsonwebtoken');
const roles = require('../middleware/roles');
const Diagnose = require('../models/diagnose');

exports.diagnose_post = async(req, res, next) => {
    console.log(req.file);
    const diagnose = new Diagnose({
        _id: new mongoose.Types.ObjectId(),
        diagnoseName: req.body.diagnoseName,
        diagnoseDesc: req.body.diagnoseDesc,
        date: req.body.date,
        medicineName: req.body.medicineName,
        dosage: req.body.dosage,
        radioImage: await toImgUrl.toImgUrl(req.file),
        radioName: req.body.radioName,
        radioDesc: req.body.radioDesc,
        patientID: req.body.patientID,
        doctorID: req.body.doctorID
    });
    diagnose.save()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Diagnose created',
                createdDiagnose: {
                    _id: result._id,
                    diagnoseName: result.diagnoseName,
                    diagnoseDesc: result.diagnoseDesc,
                    date: result.date,
                    medicineName: result.medicineName,
                    dosage: result.dosage,
                    radioName: result.radioName,
                    radioDesc: result.radioDesc,
                    patientID: result.patientID,
                    doctorID: result.doctorID,
                    analysisName: result.analysisName,
                    analysisDesc: result.analysisDesc
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

/*exports.diagnose_get_all = (req, res, next) => {
    Diagnose.find()
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                diagnose: result.map(result => {
                    return {
                        _id: result._id,
                        diagnose: result.diagnose,
                        diagnoseDesc: result.diagnoseDesc,
                        date: result.date,
                        medicineName: result.medicineName,
                        dosage: result.dosage,
                        radioName: result.radioName,
                        radioDesc: result.radioDesc,
                        patientID: result.patientID,
                        doctorID: result.doctorID
                    }
                })
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}*/

exports.diagnose_get_patient = (req, res, next) => {
    const id = req.params.patientID;
    Diagnose.find({ patientID: id })
        .exec()
        .then(result => {
            console.log('From database', result);
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).json({
                    message: 'Not found'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

/*exports.diagnose_patch = (req, res, next) => {
    const id = req.params.diagnoseID;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.proName] = ops.value;
    }
    Diagnose.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Diagnose is updated'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}*/

exports.diagnose_get_One = (req, res, next) => {
    const id = req.params.diagnoseID;
    Diagnose.findById(id)
        .exec()
        .then(result => {
            console.log('From database', result);
            if (result) {
                res.status(200).json({
                    diagnose: result
                });
            } else {
                res.status(404).json({
                    message: 'Not found'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.diagnose_get_patient_doctor = (req, res, next) => {
    console.log("1");
    const pID = req.params.patientID;
    const dID = req.params.doctorID;
    Diagnose.find({ pID, dID })
        .exec()
        .then(result => {
            console.log('From database', result);
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).json({
                    message: 'Not found'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.diagnose_get_drug = (req, res, next) => {
    const id = req.params.patientID;
    Diagnose.findById(id)
        .populate('doctorID doctorName')
        .select('medicineName dosage doctorID date')
        .exec()
        .then(result => {
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).json({
                    message: 'Not found'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.diagnose_get_radiology = (req, res, next) => {
    const id = req.params.patientID;
    Diagnose.findById(id)
        .exec()
        .then(result => {
            console.log('From database', result);
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).json({
                    message: 'Not found'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}