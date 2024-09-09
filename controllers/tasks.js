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

const getBoards = async(req, res)=>{
    const {id} = req.params
    const tasks = await Task.findOne({_id:id}).select("boards.name boards._id")

    return res.status(200).json({tasks})
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

const patchSub = async(req, res)=>{
    const {bid, cid, tid, sid, value} = req.body
    const {id} = req.params 

    const task = await Task.findByIdAndUpdate({_id:id},
        {$set:{"boards.$[board].columns.$[column].tasks.$[task].subTasks.$[subTask].isCompleted":value}},
        {arrayFilters:[{"board._id":bid}, {"column._id":cid},
            {"task._id":tid}, {"subTask._id":sid}
        ], new:true}
    )
    if(!task){
        return res.status(200).json({success:false, message:'Task not found'})
    }
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

const putBoard = async(req, res)=>{
    const task = await Task.create( {boards:{...req.body}, createdBy:req.user.username })
   return res.status(200).json({success:true, data:task})
}

const patchBoard = async(req, res)=>{
    const {id} = req.params
    const {name, columns} = req.body
    const {bid} = req.query

    const updateBoard = await Task.findByIdAndUpdate({_id:id}, {
        $set:{"boards.$[board]":{"name":name, "columns":columns}}},
        {arrayFilters:[{"board._id":bid}], new:true},)

    return res.status(200).json({success:true, message:updateBoard.boards})
}

const addBoard = async(req, res)=>{
    const {id} = req.params
    const task = await Task.findOneAndUpdate({_id:id}, {$push:{"boards":{...req.body}}}, {new:true}).select("boards.name boards._id")

    res.status(200).json({success:true,  theInfos:task})
}

const deleteBoard = async(req, res)=>{
    const {id} = req.params
    const {bid} = req.query
    let board2del = await Task.findByIdAndUpdate({_id:id}, {$pull:{"boards":{_id:bid}}}, {new:true}
    ).select("boards.name boards._id")

    if(!board2del){
        return res.status(200).json({success:false, message:'board not found'})
    }

    return res.status(200).json({success:true, message:board2del})
}

module.exports = {getTasks, updateStatus, getBoards, deleteTask, deleteBoard, 
    addTask, patchTask, patchBoard, addBoard, putBoard, patchSub
}