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
            res.status(200).json({
                count: docs.length, 
                branches: docs.map((doc) => {
                    return {
                        _id: doc._id, 
                        location: doc.location, 
                        name: doc.name, 
                        contact: doc.contact, 
                        meta: {
                            type: "GET", 
                            url: "https://nameless-harbor-15056.herokuapp.com/api/v1/branch/" + doc._id,
                            l_url: "localhost:8080/api/v1/branch/" + doc._id
                        }
                    }
                })
            })
        })
        .catch((error) => {
            res.status(404).json({
                error: error
            })
        })
})

router.get("/:branch_id", checkAuth, (req, res, next) => {
    const id = req.params.branch_id;
    Branch
        .findById({
            _id: id
        })
        .select("_id location name contact")
        .exec()
        .then((doc) => {
            res.status(200).json({
                doc
            })
        })
        .catch((error) => {
            res.status(500).json({
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