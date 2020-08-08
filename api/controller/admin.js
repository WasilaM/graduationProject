const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const bcrypt = require('bcrypt')
const roles = require('../middleware/roles');

exports.post_signup = (req, res, next) => {
    Admin.find({ email: req.body.email })
        .exec()
        .then(admin => {
            if (admin.length >= 1) {
                return res.status(409).json({
                    statusCode: 409,
                    message: 'Account exists'
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            statusCode: 500,
                            error: err
                        });
                    } else {
                        const admin = new Admin({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        admin.save()
                            .then(result => {
                                console.log(result);
                                return res.status(200).json({
                                    statusCode: 200,
                                    message: 'Admin account created',
                                });
                            })
                            .catch(err => {
                                return res.status(500).json({
                                    statusCode: 500,
                                    error: err.message
                                });
                            })
                    }
                });
            }
        })
}

exports.post_login = (req, res, next) => {
    Admin.find({ email: req.body.email }).exec()
        .then(admin => {
            if (admin.length < 1) {
                return res.status(401).json({
                    statusCode: 401,
                    message: 'Auth fail'
                });
            }
            bcrypt.compare(req.body.password, admin[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        statusCode: 401,
                        message: 'Auth fail'
                    });
                }
                if (result) {
                    const token = jwt.sign({
                            email: admin[0].email,
                            _id: admin[0]._id,
                            role: roles.ADMIN
                        },
                        process.env.JWT_KEY);
                    return res.status(200).json({
                        statusCode: 200,
                        message: 'Auth successful',
                        token: token
                    });
                }
                res.status(401).json({
                    statusCode: 401,
                    message: 'Auth fail'
                });
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