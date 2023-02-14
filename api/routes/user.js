var express = require("express");
var router = express.Router();
var mongoose = require("mongoose")
var bcrypt = require("bcrypt");
var User = require("../models/user");

router.post("/signup", (req, res, next) => {
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
                        var user = new User({
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
});

router.post('/login', (req, res, next) => {
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
                    if(response){
                        return res.status(200).json({
                            message : "Auth Successful"
                        })
                    }
                    else{
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
});

router.delete("/:email", (req, res, next) => {
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
});

module.exports = router;
