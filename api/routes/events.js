const express = require("express")
const router = express.Router();

router.get("/", function(req, res, next) {
    res.status(200).send({
        "message": "GET request for all events"
    })
});

router.get("/:event_id", function (req, res, next) {
    res.status(200).send({
        "message": "GET request for specific event: " + req.params.event_id, 
    })
});

router.post("/", function(req, res, next) {
    res.status(201).send({
        "message": "POST request to add event"
    })
})

router.patch("/:event_id", function (req, res, next) {
    res.status(200).send({
        "message": "PATCH request to update specific event: " + req.params.event_id,
    })
});

router.delete("/:event_id", function (req, res, next) {
    res.status(200).send({
        "message": "DELETE request to delete specific event: " + req.params.event_id,
    })
});

module.exports = router;