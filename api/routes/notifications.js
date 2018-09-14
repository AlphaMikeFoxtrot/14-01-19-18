const express = require("express")
const router = express.Router();

router.get("/", function (req, res, next) {
    res.status(200).json({
        "message": "GET request for all notifications"
    })
});

router.get("/:notification_id", function (req, res, next) {
    res.status(200).json({
        "message": "GET request for specific notification: " + req.params.notification_id,
    })
});

router.post("/", function (req, res, next) {
    res.status(201).json({
        "message": "POST request to add notification"
    })
})

module.exports = router;