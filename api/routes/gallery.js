const express = require('express');
const router = express.Router();
const path = require('path');
const crypto = require("crypto");
const mongoose = require('mongoose');
const multer = require("multer");
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const GalleryItem = require("../models/galleryItemModel")
const Branch = require("../models/branchModel")

router.use(methodOverride("_method"))

const mongoURI = `mongodb+srv://${process.env.MON_ATL_URME}:${process.env.MON_ATL_PSWD}@nasr-api-v1-k1kdi.mongodb.net/test?retryWrites=true`;
const conn = mongoose.createConnection(mongoURI);
let gfs;
conn.once('open', function () {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("galleryImages")
})

const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'galleryImages'
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({
    storage
});

router.get("/", function (req, res, next) {
    GalleryItem
        .find()
        .select("_id branch_id caption description date imageUrl")
        .populate("branch_id", "_id location name type contact")
        .exec()
        .then((docs) => {
            res.status(200).json({
                count: docs.length,
                galleryItems: docs.map((doc) => {
                    return {
                        _id: doc._id,
                        branch: doc.branch_id,
                        caption: doc.caption,
                        description: doc.description,
                        date: doc.date,
                        imageUrl: doc.imageUrl,
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
        .select("_id branch_id caption description date imageUrl")
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
                caption: doc.caption, 
                description: doc.description, 
                date: doc.date, 
                imageUrl: doc.imageUrl,
                meta: {
                    type: "GET", 
                    description: "GET request for all the gallery items", 
                    url: "https://nameless-harbor-15056.herokuapp.com/api/v1/galleryItems"
                }
            })
        })
});

router.post("/", upload.single("gallery_item_image"), function (req, res, next) {
    Branch
        .findById({ _id: req.body.branch_id })
        .exec()
        .then((doc) => {
            if(!doc) {
                return res.status(404).json({
                    message: "Invalid Branch ID",
                })
            }
            galleryItem = new GalleryItem({
                _id: mongoose.Types.ObjectId(),
                branch_id: req.body.branch_id,
                caption: req.body.caption,
                description: req.body.description,
                imageUrl: "https://nameless-harbor-15056.herokuapp.com/api/v1/gallery/images/" + req.file.filename
            })
            return galleryItem.save()
        })
        .then((response) => {
                console.log(response);
                res.status(201).json({
                    message: "Gallery item successfully added to the database",
                    galleryItem: {
                        _id: response._id, 
                        branch_id: response.branch_id, 
                        caption: response.caption, 
                        description: response.description, 
                        date: response.date,
                        imageUrl: response.imageUrl,
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

router.get("/images/:filename", function(req, res, next) {
    gfs.files.findOne({ filename: req.params.filename}, (err, file) => {
        if(!file || file.length === 0) {
            return res.status(404).json({
                message: "file not found", 
                error: err
            })
        }

        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
    })
})

module.exports = router;