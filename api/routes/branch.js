const express = require("express")
const router = express.Router();
const mongoose = require("mongoose")

const Branch = require("../models/branchModel")

router.get("/", (req, res, next) => {
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

router.post("/", (req, res, next) => {
    const branch = new Branch({
        _id: new mongoose.Types.ObjectId(),
        location: req.body.location, 
        name: req.body.name
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