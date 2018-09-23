const mongoose = require("mongoose")

const userSchema = mongoose.Schema({

    _id: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
    },
    username: {
        type: String, 
        required: true, 
    },
    password: {
        type: String, 
        required: true, 
    },
    date: {
        type: String,
        default: `${new Date().getDay()}/${new Date().getMonth()}/${new Date().getFullYear()} at ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
    }

})

module.exports = mongoose.model("User", userSchema);