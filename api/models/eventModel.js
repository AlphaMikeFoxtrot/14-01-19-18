const mongoose = require("mongoose")

const eventSchema = mongoose.Schema({

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
        default: new Date().getTime()
    },

})

module.exports = mongoose.model("Event", eventSchema);