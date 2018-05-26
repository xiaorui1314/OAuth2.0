const mongoose = require('mongoose')

const Schema = mongoose.Schema

const codeSchema = new Schema({
    code: String,
    expires: Number,
    clientId: String,
    userId: String
})
module.exports = mongoose.model('Code', codeSchema)