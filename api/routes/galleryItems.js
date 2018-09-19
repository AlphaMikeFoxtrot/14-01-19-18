const express = require("express")
const router = express.Router();
const multer = require("multer");
const mongoose = require("mongoose")
const fs = require("fs")
require("dotenv/config");
const d = Date.now();

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "/galleryItems/");
    }, 
    filename: function(req, file, cb){
        cb(null,  file.originalname);
        // cb(null, file.originalname)
    }
})

const fileFilter = function(req, file, cb) {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 10
    }, 
    fileFilter: fileFilter
})

const GalleryItem = require('../models/galleryItemModel');
const Branch = require("../models/branchModel");

router.get("/", function (req, res, next) {
    GalleryItem
        .find()
        .select("_id branch_id caption description date imagePath absoluteImagePath")
        .populate("branch_id", "_id location name type contact")
        .exec()
        .then((docs) => {
            res.status(200).json({
                count: docs.length, 
                galleryItems: docs.map((doc) => {
                    return {
                        _id: doc._id,
                        branch: doc.branch_id,
                        imagePath: doc.imagePath,
                        caption: doc.caption,
                        description: doc.description,
                        date: doc.date,
                        meta: {
                            type: "GET",
                            url: "https://nameless-harbor-15056.herokuapp.com/api/v1/galleryItems/" + doc._id,
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
});

router.get("/:gallery_item_id", function (req, res, next) {
    GalleryItem
        .findById({ _id: req.params.gallery_item_id })
        .select("_id branch_id caption description date imagePath absoluteImagePath")
        .populate("branch_id", "_id location name type contact")
        .exec()
        .then((doc) => {
            if(!doc) {
                return res.status(404).json({
                    message: "Gallery Item not found in the database"
                })
            }
            res.status(200).json({
                _id: doc._id, 
                branch: doc.branch_id, 
                imagePath: doc.imagePath,
                caption: doc.caption, 
                description: doc.description, 
                date: doc.date, 
                meta: {
                    type: "GET", 
                    description: "GET request for all the gallery items", 
                    url: "https://nameless-harbor-15056.herokuapp.com/api/v1/galleryItems"
                }
            })
        })
});

router.post("/", upload.single("gallery_item_image"), function (req, res, next) {

    galleryItem = new GalleryItem({
        _id: mongoose.Types.ObjectId(),
        branch_id: req.body.branch_id,
        caption: req.body.caption,
        description: req.body.description,
        absoluteImagePath: req.file.path,
        imagePath: "https://nameless-harbor-15056.herokuapp.com/api/v1/docs/" + req.file.path.replace("\\", "/").replace(/ /g, '_').replace("(", "-").replace(")", "-")
    })
    galleryItem
        .save()
        .then((response) => {
                console.log(response);
                res.status(201).json({
                    message: "Gallery item successfully added to the database",
                    galleryItem: {
                        _id: response._id,
                        branch_id: response.branch_id,
                        imagePath: response.imagePath.replace("\\", "/"),
                        caption: response.caption,
                        description: response.description,
                        date: response.date,
                        absoluteImagePath: response.absoluteImagePath,
                        meta: {
                            type: "GET",
                            url: "https://nameless-harbor-15056.herokuapp.com/api/v1/galleryItems/" + response._id,
                        }
                    }
                })
            })
            .catch((error) => {
                console.log(error);
                res.status(500).json({
                    error: error
                })
            })

    // Branch
    //     .findById({ _id: req.body.branch_id })
    //     .exec()
    //     .then((doc) => {
    //         if(!doc || req.body.branch_id.length < 24) {
    //             return res.status(404).json({
    //                 message: "Invalid Branch ID",
    //             })
    //         }
    //         galleryItem = new GalleryItem({
    //             _id: mongoose.Types.ObjectId(),
    //             branch_id: req.body.branch_id,
    //             caption: req.body.caption,
    //             description: req.body.description,
    //             absoluteImagePath: req.file.path,
    //             imagePath: "https://nameless-harbor-15056.herokuapp.com/api/v1/docs/" + req.file.path.replace("\\", "/").replace(/ /g, '_').replace("(", "-").replace(")", "-")
    //         })
    //         return galleryItem.save()
    //     })
    //     .then((response) => {
    //             console.log(response);
    //             res.status(201).json({
    //                 message: "Gallery item successfully added to the database",
    //                 galleryItem: {
    //                     _id: response._id, 
    //                     branch_id: response.branch_id, 
    //                     imagePath: response.imagePath.replace("\\", "/"),
    //                     caption: response.caption, 
    //                     description: response.description, 
    //                     date: response.date,
    //                     absoluteImagePath: response.absoluteImagePath,
    //                     meta: {
    //                         type: "GET", 
    //                         url: "https://nameless-harbor-15056.herokuapp.com/api/v1/galleryItems/" + response._id,
    //                     }
    //                 }
    //             })
    //         })
    //     .catch((error) => {
    //         console.log(error);
    //         res.status(500).json({
    //             error: error
    //         })
    //     })
})

router.delete("/:gallery_item_id", function (req, res, next) {
    const id = req.params.gallery_item_id;
    GalleryItem
        .findById({ _id: id })
        .select("absoluteImagePath")
        .exec()
        .then((doc) => {
            fs.unlink(doc.absoluteImagePath, (err) => {
                if(err) {
                    return res.status(500).json({
                        message: "Something went wrong when deleting Gallery Item", 
                        error: err
                    })
                }
            })
            return GalleryItem.deleteOne({
                _id: id
            });
        })
        .then((response) => {
            res.status(200).json({
                response: response
            })
        })
        .catch((error) => {
            res.status(404).json({
                message: "Something went wrong when deleting Gallery Item", 
                error: error
            })
        })
});

module.exports = router;