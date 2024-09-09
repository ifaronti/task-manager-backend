const express = require('express')
const router = express.Router()
const {getTasks, addBoard, getBoards, deleteTask, deleteBoard, updateStatus,
     addTask, patchTask, patchBoard, putBoard, patchSub
    } = require('../controllers/tasks')

router.route('/tasks').get(getTasks).put(putBoard)
router.route('/tasks/:id/boards/name').get(getBoards)
router.route('/tasks/:id/').patch(patchBoard)
router.route('/tasks/:id/board').patch(addBoard).delete(deleteBoard)
router.route('/tasks/:id/task').put(addTask).patch(patchTask).delete(deleteTask)
router.route('/tasks/:id/task/subtask').patch(patchSub)
router.route('/tasks/:id/task/status').patch(updateStatus)

module.exports = (router)