const mongoose = require("mongoose")

const branchSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId, 
    location: { 
        type: String, 
        required: true, 
    },
    name: {
        type: String, 
        required: true,
    }

})

module.exports = mongoose.model("Branch", branchSchema);