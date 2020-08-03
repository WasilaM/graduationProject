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
                    message: 'Account exists'
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
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
                                return res.status(201).json({
                                    message: 'Admin account created',
                                });
                            })
                            .catch(err => {
                                return res.status(500).json({
                                    error: err
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
                    message: 'Auth fail'
                });
            }
            bcrypt.compare(req.body.password, admin[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
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
                        message: 'Auth successful',
                        token: token
                    });
                }
                res.status(401).json({
                    message: 'Auth fail'
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}