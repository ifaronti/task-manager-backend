const Task = require('../models/taskSchema')

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

module.exports = {patchSub}