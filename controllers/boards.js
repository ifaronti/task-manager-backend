const Task = require('../models/taskSchema')

const getBoards = async(req, res)=>{
    const {id} = req.params
    const tasks = await Task.findOne({_id:id}).select("boards.name boards._id")

    return res.status(200).json({tasks})
}

const putBoard = async (req, res) => {
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

module.exports = {getBoards, deleteBoard, addBoard, patchBoard, putBoard}