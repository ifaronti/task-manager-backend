const mongoose = require('mongoose')
const {Schema} = mongoose


const preloadedSchema = new Schema({}, {strict:false})

module.exports = mongoose.model('PreTasks', preloadedSchema)