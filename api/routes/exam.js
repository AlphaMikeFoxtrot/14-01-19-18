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
const ExamTimeTable = require("../models/examTimeTableModel")
const Branch = require("../models/branchModel")
const checkAuth = require("../middleware/checkAuth")

router.use(methodOverride("_method"))

const mongoURI = `mongodb+srv://${process.env.MON_ATL_URME}:${process.env.MON_ATL_PSWD}@nasr-api-v1-k1kdi.mongodb.net/test?retryWrites=true`;
const conn = mongoose.createConnection(mongoURI);
let gfs;
conn.once('open', function () {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("examTimeTables")
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
                    bucketName: 'examTimeTables'
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({
    storage
});

router.get("/", checkAuth, function (req, res, next) {
    ExamTimeTable
        .find()
        .select("_id branch_id caption description date imageUrl imageId")
        .populate("branch_id", "_id location name type contact")
        .exec()
        .then((docs) => {
            res.status(200).json({
                count: docs.length,
                examTimeTables: docs.map((doc) => {
                    return {
                        _id: doc._id,
                        branch: doc.branch_id,
                        caption: doc.caption,
                        description: doc.description,
                        date: doc.date,
                        imageUrl: doc.imageUrl,
                        imageId: doc.imageId,
                        meta: {
                            type: "GET",
                            url: "https://nameless-harbor-15056.herokuapp.com/api/v1/exam/" + doc._id,
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

router.get("/:exam_time_table_id", checkAuth, function (req, res, next) {
    ExamTimeTable
        .findById({ _id: req.params.exam_time_table_id })
        .select("_id branch_id caption description date imageUrl imageId")
        .populate("branch_id", "_id location name type contact")
        .exec()
        .then((doc) => {
            if(!doc) {
                return res.status(404).json({
                    message: "Exam Time Table not found in the database"
                })
            }
            res.status(200).json({
                _id: doc._id, 
                branch: doc.branch_id, 
                caption: doc.caption, 
                description: doc.description, 
                date: doc.date, 
                imageUrl: doc.imageUrl,
                imageId: doc.imageId,
                meta: {
                    type: "GET", 
                    description: "GET request for all the exam time tables", 
                    url: "https://nameless-harbor-15056.herokuapp.com/api/v1/exam"
                }
            })
        })
});

router.post("/", checkAuth, upload.single("exam_time_table_image"), function (req, res, next) {
    Branch
        .findById({ _id: req.body.branch_id })
        .exec()
        .then((doc) => {
            if(!doc) {
                return res.status(404).json({
                    message: "Invalid Branch ID",
                })
            }
            examTimeTable = new ExamTimeTable({
                _id: mongoose.Types.ObjectId(),
                branch_id: req.body.branch_id,
                caption: req.body.caption,
                description: req.body.description,
                imageUrl: "https://nameless-harbor-15056.herokuapp.com/api/v1/exam/images/" + req.file.filename,
                imageId: req.file.id,
            })
            return examTimeTable.save()
        })
        .then((response) => {
                console.log(response);
                res.status(201).json({
                    message: "Exam Time Table successfully added to the database",
                    examTimeTable: {
                        _id: response._id, 
                        branch_id: response.branch_id, 
                        caption: response.caption, 
                        description: response.description, 
                        date: response.date,
                        imageUrl: response.imageUrl,
                        imageId: response.imageId,
                        meta: {
                            type: "GET", 
                            url: "https://nameless-harbor-15056.herokuapp.com/api/v1/exam/" + response._id,
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

router.delete("/:itemId/:imageId", checkAuth, function (req, res, next) {
    const imageId = req.params.imageId
    const itemId = req.params.itemId
    ExamTimeTable
        .deleteOne({ _id: itemId })
        .then((response) => {
            gfs.remove({_id: imageId, root: "examTimeTables"}, function (err, gridStore) {
                if (err) {
                    return res.status(500).json({
                        message: "could\'nt delete the image", 
                        error: err
                    })
                }
                res.status(200).json({
                    message: "exam time table sucessfully deleted"
                })
            });
        })
        .catch((error) => {
            res.status(500).json({
                message: "could\'nt delte the exam time table", 
                error: error
            })
        })
});

router.get("/images/:filename", function (req, res, next) {
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