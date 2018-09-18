const express = require('express')
const app = express();
const port = process.env.PORT || 8080;
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const eventsRoute = require("./api/routes/events");
const galleryItemsRoute = require("./api/routes/galleryItems");
const notificationsRoute = require("./api/routes/notifications");
const branchRoute = require("./api/routes/branch");

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

mongoose.Promise = global.Promise;
mongoose.connect("mongodb+srv://nasr-admin:nasr-admin-password@nasr-api-v1-yxyku.mongodb.net/test?retryWrites=true");

app.use("/api/v1/events", eventsRoute);
app.use("/api/v1/galleryItems", galleryItemsRoute);
app.use("/api/v1/notifications", notificationsRoute);
app.use("/api/v1/branch", branchRoute);

app.use("/api/v1/docs/galleryItems", express.static("galleryItems"));
app.use(express.static("public"));

app.use((req, res, next) => {
    const error = new Error("Page not found!");
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        error: {
            message: error.message
        }
    })
})

app.listen(port, function() {
        console.log("listening on port " + port);
    })