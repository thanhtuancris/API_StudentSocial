const mongoose = require("mongoose")

const checkinSchema = new mongoose.Schema({
    id_student: String,
    date_reg: Date,
    date_edit: Date
},{ versionKey: false })
module.exports = mongoose.model("checkins", checkinSchema);