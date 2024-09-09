const express = require('express')
const router = express.Router()
const {getTasks, getBoards} = require('../controllers/preloaded')

router.route('/pretasks').get(getTasks)
router.route('/pretasks/:id').get(getBoards)

module.exports = router