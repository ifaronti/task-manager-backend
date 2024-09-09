const mongoose = require('mongoose')
const {Schema} = mongoose
const bcrypt = require('bcryptjs')
const JWT = require('jsonwebtoken')

const userSchema = new Schema({
    username:{
        type:String,
        required:[true, 'Username is required'],
        unique:[true, 'Username already taken']
    },
    password:{
        type:String,
        required:[true, 'Password is required']
    }
})

userSchema.pre('save', async function () {
    const genSalt = await bcrypt.genSalt(7)
    return this.password = await bcrypt.hash(this.password, genSalt)
})

// userSchema.methods.createToken = function(){
//    return JWT.sign({userId:this._id, username:this.username}, process.env.JWT_SECRET, {expiresIn:"20d"})
// }

// userSchema.methods.comparePasswords = async function(candidatePassword){
//     let matches = await bcrypt.compare(candidatePassword, this.password)
//     return matches
// }

module.exports = mongoose.model('User', userSchema)