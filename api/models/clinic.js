const mongoose = require('mongoose');

const clinicSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    clinicName: { type: String, required: true },
    waitingTime: { type: String, required: true },
    workingDays: [{ type: String, required: true }],
    openingTime: { type: String, required: true },
    clossingTime: { type: String, required: true },
    number: [{
        type: String,
        required: true,
        unique: true
    }],
    address: { type: String, required: true },
    government: { type: String, required: true },
    fees: { type: String, required: true },
    doctorID: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true }
});

module.exports = mongoose.model('Clinic', clinicSchema);