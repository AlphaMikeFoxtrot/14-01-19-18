const express = require('express')
const app = express();
const port = process.env.PORT || 8080;
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config()

const eventsRoute = require("./api/routes/events");
const notificationsRoute = require("./api/routes/notifications");
const branchRoute = require("./api/routes/branch");
const galleryRoute = require("./api/routes/gallery");
const examRoute = require("./api/routes/exam")
const userRoute = require("./api/routes/user")

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', '*');
    res.append('Access-Control-Allow-Methods', '*');
    res.append("Access-Control-Allow-Headers", "Origin, Accept,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    res.append('Access-Control-Allow-Credentials', true);
    next();
});

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

mongoose.Promise = global.Promise;

// MongoDB Atlas v2:
mongoose.connect(`mongodb+srv://${process.env.MON_ATL_URME}:${process.env.MON_ATL_PSWD}@nasr-api-v1-k1kdi.mongodb.net/test?retryWrites=true`);

// MongoDB Atlas v1:
// mongoose.connect(`mongodb+srv://${process.env.MON_ATL_URME}:${process.env.MON_ATL_PSWD}@nasr-api-v1-yxyku.mongodb.net/test?retryWrites=true`);

// MLAB: 
// mongoose.connect("mongodb://mlab-nasr-admin:"+process.env.MLAB_PSWD+"@ds261332.mlab.com:61332/nasr-school-api-v1");

app.use("/api/v1/events", eventsRoute);
app.use("/api/v1/notifications", notificationsRoute);
app.use("/api/v1/branch", branchRoute);
app.use("/api/v1/gallery", galleryRoute);
app.use("/api/v1/exam", examRoute);
app.use("/api/v1/user", userRoute);

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