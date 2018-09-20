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

router.post("/", upload.single("galleryImage"), (req, res) => {
    res.json({
        file: req.file
    })
})

router.get('/files', (req, res) => {
    gfs.files.find().toArray((err, files) => {
        return res.json({
            files
        })
    })
});

router.get('/files/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename}, (err, file) => {
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
    })
})

module.exports = router;