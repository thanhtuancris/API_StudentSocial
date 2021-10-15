const mongoose = require("mongoose")

const noteSchema = new mongoose.Schema({
    id_student: String,
    contentrm: Array
},{ versionKey: false })
module.exports = mongoose.model("notetables", noteSchema);