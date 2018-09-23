const mongoose = require("mongoose")

const galleryItemSchema = mongoose.Schema({

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
        type: String,
        default: `${new Date().getDay() + 1}/${new Date().getMonth() + 1}/${new Date().getFullYear()} at ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
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

module.exports = mongoose.model("GalleryItem", galleryItemSchema);