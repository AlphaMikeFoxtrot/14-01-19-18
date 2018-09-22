const express = require("express")
const router = express.Router();
const mongoose = require("mongoose")

const checkAuth = require("../middleware/checkAuth")

const Branch = require("../models/branchModel")

router.get("/", checkAuth, (req, res, next) => {
    Branch
        .find()
        .exec()
        .then((docs) => {
            res.status(200).json({docs})
        })
        .catch((error) => {
            res.status(404).json({
                error: error
            })
        })
})

router.post("/", checkAuth, (req, res, next) => {
    const branch = new Branch({
        _id: new mongoose.Types.ObjectId(),
        location: req.body.location, 
        name: req.body.name,
        type: req.body.type,
        contact: req.body.contact
    })
    branch
        .save()
        .then((response) => {
            res.status(200).json({
                response: response
            })
        })
        .catch((error) => {
            res.status(500).json({
                error: error
            })
        })
})

router.delete("/:branch_id", checkAuth, (req, res, next) => {
    const id = req.params.branch_id;
    Branch
        .remove({_id: id})
        .exec()
        .then((response) => {
            res.status(200).json({
                response: response
            })
        })
        .catch((error) => {
            res.status(500).json({
                error: error
            })
        })
})

module.exports = router;