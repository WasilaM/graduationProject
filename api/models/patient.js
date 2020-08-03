const mongoose = require('mongoose');

const patientSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstName: { type: String },
    middleName: { type: String },
    lastName: { type: String },
    birthDate: { type: String },
    gender: { type: String },
    nationalID: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    },
    password: { type: String, required: true },
    job: { type: String },
    status: { type: String },
    phone: [{ type: String }],
    address: { type: String },
    government: { type: String },
    patientImage: { type: String },
    aboutYou: { type: String }
});

module.exports = mongoose.model('Patient', patientSchema);