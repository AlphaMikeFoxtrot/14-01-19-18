const express = require("express")
const router = express.Router();

router.get("/", function (req, res, next) {
    res.status(200).send({
        "message": "GET request for all gallery items"
    })
});

router.get("/:gallery_item_id", function (req, res, next) {
    res.status(200).send({
        "message": "GET request for specific gallery item: " + req.params.gallery_item_id,
    })
});

router.post("/", function (req, res, next) {
    res.status(201).send({
        "message": "POST request to add gallery_item"
    })
})

router.delete("/:gallery_item_id", function (req, res, next) {
    res.status(200).send({
        "message": "DELETE request to delete specific gallery_item: " + req.params.gallery_item_id,
    })
});

module.exports = router;