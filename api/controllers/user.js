const mongoose = require("mongoose")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.userSignup = (req, res, next) => {
    User.find({ email: req.body.email }).exec()
        .then(doc => {
            if (doc.length >= 1) {
                return res.status(422).json({
                    message: "Email exists"
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                            .then(result => {
                                res.status(201).json({
                                    message: "User created"
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            })
                    }
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.userLogin = (req, res, next) => {
    User.find({ email: req.body.email }).exec()
        .then(docs => {
            if (docs.length < 1) {
                return res.status(401).json({
                    message: "Auth Failed"
                });
            } else {
                bcrypt.compare(req.body.password, docs[0].password, (err, response) => {
                    if (err) {
                        return res.status(401).json({
                            message: "Auth Failed"
                        });
                    }
                    if (response) {
                        const token = jwt.sign({
                            email: docs[0].email,
                            userId: docs[0]._id
                        },
                            process.env.JWT_KEY,
                            {
                                expiresIn: "1h"
                            });
                        return res.status(200).json({
                            message: "Auth Successful",
                            token : token
                        });
                    }
                    else {
                        return res.status(401).json({
                            message: "Auth Failed"
                        });
                    }
                });
            }

        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
};

exports.userDelete =  (req, res, next) => {
    User.remove({ email: req.params.email }).exec()
        .then(doc => {
            res.status(200).json({
                message: "User deleted"
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
};