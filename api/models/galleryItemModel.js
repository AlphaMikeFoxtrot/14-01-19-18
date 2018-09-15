const mongoose = require("mongoose")

const galleryItemSchema = mongoose.Schema({

    _id: {
        type: mongoose.Schema.Types.ObjectId
    },
    branch_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Branch"
    },
    imagePath: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    caption: {
        type: String, 
        required: false, 
    },
    date: {
        type: Date,
        default: Date.now
    },

})

module.exports = mongoose.model("GalleryItem", galleryItemSchema);