const express = require("express")
const router = express.Router();
const mongoose = require("mongoose")

const Event = require("../models/eventModel");

router.get("/", function(req, res, next) {
    Event
        .find()
        .exec()
        .then((docs) => {
            console.log(docs);
            res.status(200).json({
                message: "GET request for all events",
                docs
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
        .find({ _id: id})
        .exec()
        .then((doc) => {
            console.log(doc);
            res.status(200).json({
                message: "GET request specific event: " + id,
                doc
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
                response
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
    res.status(200).json({
        message: "PATCH request to update specific event: " + req.params.event_id,
    })
});

router.delete("/:event_id", function (req, res, next) {
    res.status(200).json({
        message: "DELETE request to delete specific event: " + req.params.event_id,
    })
});

module.exports = router;