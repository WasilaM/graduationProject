const mongoose = require('mongoose');
const Diagno = require('../models/diagno');
const toImgUrl = require('../utils/index');
const roles = require('../middleware/roles');
const diagno = require('../models/diagno');

exports.diagno_post = async(req, res, next) => {
    console.log(req.file);
    const diagno = new Diagno({
        _id: new mongoose.Types.ObjectId(),
        diagnose: req.body.diagnose,
        diagnoseDesc: req.body.diagnoseDesc,
        date: req.body.date,
        medicine: req.body.medicine,
        dosage: req.body.dosage,
        radioImage: await toImgUrl.toImgUrl(req.file),
        radioDesc: req.body.radioDesc,
        radioName: req.body.radioName,
        analysisDesc: req.body.analysisDesc,
        analysisName: req.body.analysisName,
        patientID: req.body.patientID,
        doctorID: req.body.doctorID
    });
    diagno.save()
        .then(result => {
            console.log(result);
            return res.status(200).json({
                message: 'Diagnose created',
                createdDiagnose: {
                    id: result._id,
                    diagnose: result.diagnose,
                    diagnoseDesc: result.diagnoseDesc,
                    date: result.date,
                    medicine: result.medicine,
                    dosage: result.dosage,
                    radioImage: result.radioImage,
                    radioDesc: result.radioDesc,
                    radioName: result.radioName,
                    analysisName: result.analysisName,
                    analysisDesc: result.analysisDesc,
                    patientID: result.patientID,
                    doctorID: result.doctorID
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

exports.diagno_get_one = (req, res, next) => {
    const id = req.params.diagnoID;
    Diagno.findById(id)
        .exec()
        .then(diagno => {
            if (!diagno) {
                return res.status(404).json({
                    message: 'Not found'
                });
            }
            return res.status(200).json({
                Diagno: diagno
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                error: err
            });
        });
}

exports.diagno_get_patient = (req, res, next) => {
    const id = req.params.patientID;
    Diagno.find({ patientID: id })
        .exec()
        .then(result => {
            if (result) {
                return res.status(200).json({
                    Diagno: result
                });
            } else {
                return res.status(404).json({
                    message: 'Not found'
                });
            }
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                error: err
            });
        });
}

exports.diagno_get_drug = (req, res, next) => {
    const id = req.params.patientID;
    Diagno.find({ patientID: id })
        .populate('doctorID doctorName')
        .select('medicine dosage doctorID date')
        .exec()
        .then(result => {
            if (result) {
                return res.status(200).json({
                    Drug: result
                });
            } else {
                return res.status(404).json({
                    message: 'Not found'
                });
            }
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                error: err
            });
        });
}

exports.diagno_get_radio = (req, res, next) => {
    const id = req.params.patientID;
    Diagno.find({ patientID: id })
        .select('id radioName radioDesc radioImage')
        .exec()
        .then(result => {
            if (result) {
                return res.status(200).json({
                    Radiology: result
                });
            } else {
                return res.status(404).json({
                    message: 'Not found'
                });
            }
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                error: err
            });
        });
}

exports.diagno_patient_doctor = (req, res, next) => {
    const pID = req.params.patientID;
    const dID = req.params.doctorID;
    Diagno.find({ patientID: pID, doctorID: dID })
        .exec()
        .then(result => {
            if (result) {
                return res.status(200).json({
                    Diagno: result
                });
            } else {
                return res.status(404).json({
                    message: 'Not found'
                });
            }
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                error: err
            });
        });
}