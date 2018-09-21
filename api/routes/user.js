const express = require("express")
const router = express.Router();
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const User = require("../models/userModel")

router.post("/signup", (req, res, next) => {
    User.find({
            username: req.body.username
        })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: "Mail exists"
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            username: req.body.username,
                            password: hash
                        });
                        user
                            .save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: "User created"
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        });
});

router.post("/signin", function(req, res, next) {
    User
        .find({ username: req.body.username })
        .exec()
        .then((user) => {
            if(user.length < 1) {
                return res.status(401).json({
                    message: "Auth Fail"
                })
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if(err) {
                    return res.status(401).json({
                        message: "Auth Fail"
                    })
                }
                if(result) {
                    const token = jwt.sign(
                        {
                            username: user[0].username, 
                            id: user[0]._id
                        },
                        process.env.JWT_PRIVATE, 
                        {
                            expiresIn: "1h"
                        }
                    )
                    return res.status(200).json({
                        message: "Auth successful",
                        token: token 
                    })
                }
                return res.status(401).json({
                    message: "Auth Fail"
                })
            })
        })
        .catch((error) => {
            console.log(error)
            res.status(401).json({
                message: "Auth Fail"
            })
        })
})

router.delete("/:userId", (req, res, next) => {
    User.remove({
            _id: req.params.userId
        })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "User deleted"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;