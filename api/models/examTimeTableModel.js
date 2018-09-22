const mongoose = require("mongoose")

const examTimeTableSchema = mongoose.Schema({

    _id: {
        type: mongoose.Schema.Types.ObjectId
    },
    branch_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Branch", 
        required: true,
    },
    caption: {
        type: String, 
        required: true, 
    },
    description : {
        type: String,
        default: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.Cras sed dui id odio tincidunt luctus."
    },
    date: {
        type: Date,
        default: Date.now()
    },
    imageUrl: {
        type: mongoose.Schema.Types.Mixed, 
        required: true, 
    },
    imageId: {
        type: mongoose.Schema.Types.Mixed, 
        required: true, 
    }

})

module.exports = mongoose.model("ExamTimeTable", examTimeTableSchema);