const Task = require('../models/preloaded')

const getTasks = async(req, res)=>{
    // const {id} = req.params
    const {id, name} = req.query
    const task = await Task.find({_id:id}, {boards:{$elemMatch:{name:name}}})

    if(!task){
        return res.status(404).json({success:false, message:`Task with id ${id} not found`})
    }

    return res.status(200).json(task)
}

const getBoards = async(req, res)=>{
    const {id} = req.params
    const tasks = await Task.findById({_id:id}).select("boards.name")

    return res.status(200).json(tasks)
}

module.exports = {getTasks, getBoards}