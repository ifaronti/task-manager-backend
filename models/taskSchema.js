const mongoose = require('mongoose')
const {Schema} = mongoose

const subTasks = new Schema({
    title:{type:String},
    isCompleted:{type:Boolean, default:false},
    
})

const taskSchema = new Schema({
    title:{type:String},
    description:String,
    status:{
        type:String, 
        default:"Todo", 
        enum:["Todo", "Doing", "Done"], 
        required:true
    },
    subTasks:[subTasks]
})

const columnSchema = new Schema({
    name:{type:String},
    tasks: [taskSchema]
})

const boardSchema = new Schema({
    name:{type:String},
    columns:[columnSchema]
})

const allTasks = new Schema({
    boards:[boardSchema],
    createdBy:String
})

module.exports = mongoose.model('Tasks', allTasks)