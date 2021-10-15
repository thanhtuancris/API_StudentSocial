const mongoose = require("mongoose")

const yeucauSchema = new mongoose.Schema({
    id_student: String,
    value: Number,
    type_card: String,
    time: String
},{ versionKey: false })
module.exports = mongoose.model("yeucau", yeucauSchema);