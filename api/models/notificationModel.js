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
        type: Date,
        default: Date.now
    },

})

module.exports = mongoose.model("Notification", notificationSchema);