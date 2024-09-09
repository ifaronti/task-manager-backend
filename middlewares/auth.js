const jwt = require('jsonwebtoken')

const auth = async(req, res, next)=>{
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer')){
       return res.status(200).json({success:false, message:'Invalid credential'})
    }

    const token = await authHeader.split(' ')[1]
    
    try{
        const payload = await jwt.verify(token, process.env.JWT_SECRET)
        req.user = {userId:payload.userId, username:payload.username}
        next()
    }
    catch (err) {
        res.send(err.message)
    }
}

module.exports = auth;