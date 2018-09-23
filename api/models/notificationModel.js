const mongoose = require("mongoose")

const notificationSchema = mongoose.Schema({

    _id: {
        type: mongoose.Schema.Types.ObjectId
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    date: {
        type: String,
        default: `${new Date().getDay()}/${new Date().getMonth()}/${new Date().getFullYear()} at ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
    },

})

module.exports = mongoose.model("Notification", notificationSchema);