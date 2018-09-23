const express = require("express")
const router = express.Router();
const mongoose = require("mongoose")
const checkAuth = require("../middleware/checkAuth")

const Notification = require("../models/notificationModel");

const FCM = require('fcm-push');
const serverKey = process.env.FRBS_SRVR_K;
const fcm = new FCM(serverKey);

router.get("/", checkAuth, function (req, res, next) {
    Notification
        .find({})
        .exec()
        .then((docs) => {
            res.status(200).json({
                count: docs.length, 
                notifications: docs.map((doc) => {
                    return {
                        _id: doc._id, 
                        title: doc.title, 
                        body: doc.body, 
                        date: doc.date, 
                        meta: {
                            type: "GET", 
                            url: "https://nameless-harbor-15056.herokuapp.com/api/v1/notifications/" + doc._id,
                        }
                    }
                })
            })
        })
});

router.get("/:notification_id", checkAuth, function (req, res, next) {
    Notification
        .findById({_id: req.params.notification_id})
        .exec()
        .then((doc) => {
            res.status(200).json({
                _id: doc._id,
                title: doc.title,
                body: doc.body,
                date: doc.date,
                meta: {
                    type: "GET", 
                    description: "get all notifications", 
                    url: "https://nameless-harbor-15056.herokuapp.com/api/v1/notifications"
                }
            })
        })
});

router.post("/", checkAuth, function(req, res, next) {
    const notification = new Notification({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title, 
        body: req.body.notificationBody
    })

    notification
        .save()
        .then((response) => {
                const message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                    to: '/topics/all',
                    collapse_key: '229626601465',

                    notification: {
                        title: req.body.title,
                        body: req.body.notificationBody
                    },

                    data: { //you can send only notification or only data(or include both)
                        notificationd_id: response._id, 
                    }
                };

                fcm.send(message, function (err, result) {
                    if (err) {
                        console.log("Something has gone wrong!");
                        res.status(500).json({
                            message: "error sending",
                            error: err
                        })
                    } else {
                        console.log("Successfully sent with response: ", response);
                        res.status(200).json({
                            message: "notification successfully sent", 
                            response: result,
                            notification: {
                                _id: response._id, 
                                title: response.title, 
                                body: response.body, 
                                date: response.date
                            }
                        })
                    }
                });

        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({
                message: "error saving", 
                error: error
            })
        })
})

module.exports = router;