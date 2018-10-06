const mongoose = require("mongoose")

var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

var d = new Date();
var day = days[d.getDay()];
var hr = d.getHours();
var min = d.getMinutes();
if (min < 10) {
    min = "0" + min;
}
var ampm = "am";
if (hr > 12) {
    hr -= 12;
    ampm = "pm";
}
var month = months[d.getMonth()];

function ordinal_suffix_of(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

const today = `${ordinal_suffix_of(new Date().getDay())} ${month}, ${new Date().getFullYear()} (${day})`

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
        // default: `${new Date().getDay() + 1}/${new Date().getMonth() + 1}/${new Date().getFullYear()} at ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
        default: today
    },

})

module.exports = mongoose.model("Event", eventSchema);