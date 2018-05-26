const mongoose = require('mongoose')

const Schema = mongoose.Schema

const accessSchema = new Schema({
    code: String,
    clientId: String,
    userId: String,
    expires: Number
})
module.exports = mongoose.model('Access', accessSchema)