const mongoose = require("mongoose")

const eventSchema = mongoose.Schema({

    _id: {
        type: mongoose.Schema.Types.ObjectId
    },
    branch_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Branch", 
        required: true, 
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String, 
        required: true
    },
    eventDate: {
        type: String, 
        required: true,
    },
    location: {
        type: String, 
        required: true, 
    },
    addedOn: {
        type: String,
        default: `${new Date().getDay()}/${new Date().getMonth()}/${new Date().getFullYear()} at ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
    },

})

module.exports = mongoose.model("Event", eventSchema);