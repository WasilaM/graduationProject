const mongoose = require('mongoose');

const doctorSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstName: { type: String, required: true },
    middleName: { type: String, required: true },
    lastName: { type: String, required: true },
    birthDate: { type: String, required: true },
    gender: { type: String, required: true },
    nationalID: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    },
    password: { type: String, required: true },
    job: { type: String, required: true },
    bio: { type: String, required: true },
    speciality: { type: String, required: true },
    status: { type: String, required: true },
    number: [{
        type: String,
        required: true,
        unique: true
    }],
    address: { type: String, required: true },
    government: { type: String, required: true },
    doctorImage: { type: String, required: true },
    long: { type: String, required: true },
    lat: { type: String, required: true }
});

module.exports = mongoose.model('Doctor', doctorSchema);