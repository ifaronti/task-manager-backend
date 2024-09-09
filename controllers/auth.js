const User = require('../models/user')
const Task = require('../models/taskSchema')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const register = async (req, res) => {
   const user = await User.create({...req.body})
   const firstTask = await Task.create({createdBy:req.body.username})
   
   return res.status(200).json({user:`Account Created with username: ${user.username} with ${firstTask.boards.length} amount of boards`})
}

const login = async (req, res) => {
   try {
      const { username, password } = req.body
      if (!username || !password) {
         res.end('invalid user details')
      }

      const user = await User.findOne({username:username})
      if (!user) {
         res.end('User error')
      }
      
      isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
         res.end('user authentication failed; please try again')
      }  

      const token = jwt.sign({userId:user._id, username:username}, process.env.JWT_SECRET, {expiresIn:"20d"})
      const task = await Task.findOne({ createdBy: user.username }).select("boards.name boards._id")
      let respy = { success: true, user: user.username, token: token, data: task }
      return res.status(200).json(respy)
   }
   catch (err) {
      res.status(200).json({success:false, message:err.message, allOfErr:err})
   }
}

module.exports = {register, login}