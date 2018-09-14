const express = require('express')
const app = express();
const port = process.env.PORT || 8080;
const eventsRoute = require("./api/routes/events");
const galleryItemsRoute = require("./api/routes/galleryItems");
const notificationsRoute = require("./api/routes/notifications");

app.use("/events", eventsRoute);
app.use("/galleryItems", galleryItemsRoute);
app.use("/notifications", notificationsRoute);

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

app
    .use(express.static("public"))
    .listen(port, function() {
        console.log("listening on port " + port);
    })