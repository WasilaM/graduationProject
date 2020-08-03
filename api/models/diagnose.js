const mongoose = require('mongoose');

const diagnoseSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    diagnoseName: { type: String },
    diagnoseDesc: { type: String },
    date: { type: String },
    medicineName: [{ type: String }],
    dosage: [{ type: String }],
    radioImage: [{ type: String }],
    radioName: [{ type: String }],
    radioDesc: [{ type: String }],
    analysisName: [{ type: String }],
    analysisDesc: [{ type: String }],
    analysisImage: [{ type: String }],
    patientID: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
    doctorID: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }
});

module.exports = mongoose.model('Diagnose', diagnoseSchema);