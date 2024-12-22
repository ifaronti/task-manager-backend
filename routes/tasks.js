const express = require('express')
const router = express.Router()
const {getTasks, deleteTask, updateStatus,
     addTask, patchTask
} = require('../controllers/tasks')
    
const { addBoard, getBoards,
    deleteBoard, putBoard, patchBoard } = require('../controllers/boards.js')

const {patchSub} = require('../controllers/subtasks.js')

router.route('/tasks').get(getTasks).put(putBoard)
router.route('/tasks/:id/boards/name').get(getBoards)
router.route('/tasks/:id/').patch(patchBoard)
router.route('/tasks/:id/board').patch(addBoard).delete(deleteBoard)
router.route('/tasks/:id/task').put(addTask).patch(patchTask).delete(deleteTask)
router.route('/tasks/:id/task/subtask').patch(patchSub)
router.route('/tasks/:id/task/status').patch(updateStatus)

module.exports = (router)