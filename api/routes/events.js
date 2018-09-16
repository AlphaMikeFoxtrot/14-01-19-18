const epxress = require('express')
const router = epxress.Router();
const mongoose = require("mongoose")

const Event = require("../models/eventModel");

router.get("/", function(req, res, next) {
    Event
        .find()
        .exec()
        .then((docs) => {
            res.status(200).json({
                count: docs.length, 
                events: docs.map((doc) => {
                    return {
                        _id: doc._id, 
                        title: doc.title, 
                        body: doc.body, 
                        date: doc.date, 
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

router.get("/:event_id", function (req, res, next) {
    const id = req.params.event_id
    Event
        .findById(id)
        .select("_id title body date")
        .exec()
        .then((doc) => {
            res.status(200).json({
                _id: doc._id,
                title: doc.title,
                body: doc.body,
                date: doc.date,
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

router.post("/", function(req, res, next) {
    const event = new Event({
        _id: new mongoose.Types.ObjectId(), 
        title: req.body.title, 
        body: req.body.body, 
    })
    event
        .save()
        .then((response) => {
            console.log(response);
            res.status(200).json({
                message: "successfully uploaded new event", 
                event: {
                    _id: response._id, 
                    title: response.title, 
                    body: response.body, 
                    date: response.date,
                    meta: {
                        type: "GET", 
                        description: "Get a list of all the events", 
                        url: "https://nameless-harbor-15056.herokuapp.com/api/v1/events"
                    }
                }
            })
        })
        .catch((error) => { 
            console.log(error);
            res.status(404).json({
                message: "error occured when uploading event", 
                error
            })
        })
})

router.patch("/:event_id", function (req, res, next) {
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

router.delete("/:event_id", function (req, res, next) {
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
