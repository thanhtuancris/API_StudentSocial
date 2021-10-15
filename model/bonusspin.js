const mongoose = require("mongoose")

const bonusspinSchema = new mongoose.Schema({
    id_student: String,
    reward: Array,
    noreward: Array,
    coin: Array
},{ versionKey: false })
module.exports = mongoose.model("bonusspins", bonusspinSchema);