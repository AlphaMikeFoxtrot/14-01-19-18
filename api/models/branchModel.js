const mongoose = require("mongoose")

const branchSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId, 
    location: { 
        type: String, 
        required: true, 
    },
    name: {
        type: mongoose.Schema.Types.Mixed, 
        required: true,
    },
    type: {
        type: String, 
        required: true  
    },
    contact: {
        type: mongoose.Schema.Types.Mixed, 
        required: true,
    }

})

module.exports = mongoose.model("Branch", branchSchema);