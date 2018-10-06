const epxress = require('express')
const router = epxress.Router();
const mongoose = require("mongoose")

const FCM = require('fcm-push');
const serverKey = process.env.FRBS_SRVR_K;
const fcm = new FCM(serverKey);

const checkAuth = require("../middleware/checkAuth")

const Event = require("../models/eventModel");
const Branch = require("../models/branchModel")

router.get("/:branch_id", checkAuth, function (req, res, next) {

    if (!mongoose.Types.ObjectId.isValid(req.params.branch_id)) {
        res.status(404).json({
            message: "Invalid Branch ID"
        })
        return;
    }

    Event
        .find({ branch_id: req.params.branch_id })
        .populate("branch_id", "_id location name type contact")
        .exec()
        .then((docs) => {
            res.status(200).json({
                count: docs.length, 
                events: docs.map((doc) => {
                    return {
                        _id: doc._id, 
                        branch: doc.branch_id,
                        title: doc.title, 
                        body: doc.body, 
                        addedOn: doc.addedOn, 
                        location: doc.location, 
                        eventDate: doc.eventDate, 
                        meta: {
                            type: "GET", 
                            url: "https://nameless-harbor-15056.herokuapp.com/api/v1/events/" + doc._id
                        }
                    }
                })
            })
        })
        .catch((error) => {
            console.log(error);
            res.status(404).json({
                error
            })
        })
});

router.get("/:event_id", checkAuth, function (req, res, next) {
    const id = req.params.event_id
    Event
        .findById({ _id: id })
        .populate("branch_id", "_id location name type contact")
        .exec()
        .then((doc) => {
            res.status(200).json({
                _id: doc._id,
                branch: doc.branch_id,
                title: doc.title,
                body: doc.body,
                addedOn: doc.addedOn,
                location: doc.location,
                eventDate: doc.eventDate,
                meta: {
                    type: "GET",
                    url: "https://nameless-harbor-15056.herokuapp.com/api/v1/events/" + doc._id
                }
            })
        })
        .catch((error) => {
            console.log(error);
            res.status(404).json({
                error
            })
        })
});

router.post("/", checkAuth, function (req, res, next) {

    const branch_id = req.body.branch_id;
    Branch
        .findById({ _id: branch_id })
        .exec()
        .then((doc) => {
            if(!doc) {
                return res.status(404).json({
                    message: "invalid branch id"
                })
            }
            const event = new Event({
                _id: new mongoose.Types.ObjectId(),
                branch_id: branch_id,
                title: req.body.title,
                body: req.body.body,
                location: req.body.location,
                eventDate: req.body.event_date,
            })
            return event.save()
        })
        .then((response) => {
            const message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                to: '/topics/all',
                collapse_key: '229626601465',

                notification: {
                    title: req.body.title,
                    body: req.body.body
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
                    console.log(response);
                    res.status(200).json({
                        message: "successfully uploaded new event",
                        event: {
                            _id: response._id,
                            branch_id: branch_id,
                            title: response.title,
                            body: response.body,
                            addedOn: response.addedOn,
                            location: response.location,
                            eventDate: response.eventDate,
                            meta: {
                                type: "GET",
                                description: "Get a list of all the events",
                                url: "https://nameless-harbor-15056.herokuapp.com/api/v1/events"
                            }
                        }
                    })
                }
            });
        })
        .catch((error) => { 
            console.log(error);
            res.status(404).json({
                message: "error occured when uploading event", 
                error
            })
        })
})

router.patch("/:event_id", checkAuth, function (req, res, next) {
    const id = req.params.event_id;
    const updateOps = {}
    for (const ops of req.body) {
        updateOps[ops.keyToUpdate] = ops.newValue
    }
    Event.update({ _id: id }, { $set: updateOps }).exec()
        .then((response) => {
            console.log(response);
            res.status(200).json({
                message: "Successfully updated event details", 
                meta: {
                    type: "GET", 
                    url: "https://nameless-harbor-15056.herokuapp.com/api/v1/events/" + id
                }
            })
        })
        .catch((error) => { 
            console.log(error);
            res.status(404).json({
                error: error
            })
        })
});

router.delete("/:event_id", checkAuth, function (req, res, next) {
    const id = req.params.event_id;
    Event.remove({ _id: id }).exec()
        .then((response) => {
            console.log(response);
            res.status(200).json({
                message: "Successfully deleted event from the database", 
                meta: {
                    type: "GET",
                    description: "Get a list of all the events",
                    url: "https://nameless-harbor-15056.herokuapp.com/api/v1/events"
                }
            })
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({
                error: error
            })
        })
});

module.exports = router;
