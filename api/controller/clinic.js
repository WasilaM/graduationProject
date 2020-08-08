const mongoose = require('mongoose');

const Clinic = require('../models/clinic');

exports.clinic_post = (req, res, next) => {
    const clinic = new Clinic({
        _id: new mongoose.Types.ObjectId(),
        clinicName: req.body.clinicName,
        waitingTime: req.body.waitingTime,
        workingDays: req.body.workingDays,
        openingTime: req.body.openingTime,
        clossingTime: req.body.clossingTime,
        number: req.body.number,
        address: req.body.address,
        government: req.body.government,
        fees: req.body.fees,
        doctorID: req.body.doctorID
    });
    clinic.save()
        .then(result => {
            console.log(result);
            res.status(200).json({
                statusCode: 200,
                message: 'New clinic is added',
                createdClinic: {
                    id: result._id,
                    clinicName: result.clinicName,
                    waitingTime: result.waitingTime,
                    workingDays: result.workingDays,
                    openingTime: result.openingTime,
                    clossingTime: result.clossingTime,
                    number: result.number,
                    address: result.address,
                    government: result.government,
                    fees: result.fees,
                    doctorID: result.doctorID,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/clinic/' + result._id
                    }
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

exports.clinic_get_one = (req, res, next) => {
    const id = req.params.clinicID;
    Clinic.findById(id)
        .exec()
        .then(clinic => {
            if (!clinic) {
                return res.status(404).json({
                    statusCode: 404,
                    message: 'Clinic not found'
                });
            }
            res.status(200).json({
                statusCode: 200,
                clinic: clinic,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/clinic'
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

exports.clinic_patch = (req, res, next) => {
    const id = req.params.clinicID;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.proName] = ops.value;
    }
    Clinic.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                statusCode: 200,
                message: 'Clinic updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/clinic' + id
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

exports.clinic_delete = (req, res, next) => {
    Clinic.remove({ _id: req.params.clinicID })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                statusCode: 200,
                message: 'Clinic deleted',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/clinic'
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