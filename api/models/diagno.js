const mongoose = require('mongoose');

const diagnoSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    diagnose: { type: String },
    diagnoseDesc: { type: String },
    date: { type: String },
    medicine: [{ type: String }],
    dosage: [{ type: String }],
    radioImage: { type: String },
    radioDesc: { type: String },
    radioName: { type: String },
    analysisName: { type: String },
    analysisDesc: { type: String },
    patientID: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
    doctorID: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
    diagnoNum: { type: String }
});

module.exports = mongoose.model('Diagno', diagnoSchema);