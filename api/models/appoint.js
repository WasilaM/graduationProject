const mongoose = require('mongoose');

const appointSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    appointStart: { type: String, required: true },
    appointEnd: { type: String, required: true },
    appointDate: { type: String, required: true },
    appointStatus: { type: String, required: true },
    doctorID: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    patientID: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    clinicID: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic', required: true }
});

module.exports = mongoose.model('Appoint', appointSchema);