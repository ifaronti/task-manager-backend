const Task = require('../models/taskSchema')

const getTasks = async(req, res)=>{
    const {id, bid} = req.query
    const task = await Task.findOne({createdBy:req.user.username}, 
        {boards:{$elemMatch:{_id:bid}}}
    )

    if(!task){
        return res.status(200).json({success:false, message:`Task with id ${id} not found`})
    }
    return res.status(200).json({task})
}

const addTask = async(req, res)=>{
    const {bid, cid} = req.query
    const {id} = req.params

    const add2Task = await Task.findOneAndUpdate({_id:id}, 
        {$push:{"boards.$[board].columns.$[column].tasks":req.body}},
        {arrayFilters:[{"board._id":bid}, {"column._id":cid}], new:true}
    )
    return res.status(200).json({success:true, data:add2Task.boards})
}

const patchTask = async(req, res)=>{
    const {bid, cid, tid} = req.query
    const {id} = req.params
    
   let task =  await Task.findByIdAndUpdate({_id:id}, 
        {$set:{"boards.$[board].columns.$[column].tasks.$[task]":{...req.body}}},
        {arrayFilters:[{"board._id":bid}, {"column._id":cid}, {"task._id":tid}], new:true})

    return res.status(200).json({success:true, data:task.boards})
}

const updateStatus = async(req, res)=>{
    const {bid, tid, oldCID, newCID} = req.query
    const {id} = req.params

      await Task.findByIdAndUpdate({_id:id}, 
        {$pull:{"boards.$[board].columns.$[column].tasks":{_id:tid}}},
        {arrayFilters:[{"board._id":bid}, {"column._id":oldCID}]}
        )
  let newTask =  await Task.findByIdAndUpdate({_id:id}, 
        {$push:{"boards.$[board].columns.$[column].tasks":req.body}},
        {arrayFilters:[{"board._id":bid}, {"column._id":newCID}], new:true}
    )

    return res.status(200).json({success:true, data:newTask.boards})
}

const deleteTask = async(req, res)=>{
    const {id} = req.params
    const {bid, cid, tid} = req.query

    const task2del = await Task.findByIdAndUpdate({_id:id}, 
        {$pull:{"boards.$[board].columns.$[col].tasks":{_id:tid}}},
        {arrayFilters:[{"board._id":bid}, {"col._id":cid}], new:true}
    )
 
    return res.status(200).json({success:true, message:`Item Deleted from ${task2del._id}`, data:task2del.boards})
}

module.exports = {getTasks, updateStatus, deleteTask, 
    addTask, patchTask
}