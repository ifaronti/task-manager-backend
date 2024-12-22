const express = require('express')
const app = express()
require('dotenv').config()
require('express-async-errors')

//security packages
const helmet = require('helmet')
const xss = require('xss-advanced')
const rateLimit = require('express-rate-limit')
const cors = require('cors')
app.use(express.json())
// app.use(require('body-parser').urlencoded({ extended: false }));

app.set('trust proxy', 1)
app.use(cors({
      allowedHeaders: ["authorization", "Content-Type", "Access-Control-Allow-Origin"],
      exposedHeaders: ["authorization", "Access-Control-Allow-Origin"],
      origin: "*",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      preflightContinue: true,
    //   credentials:true,
      maxAge:600
    }))
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 1000
}))
app.use(helmet())
app.use(xss())

//routes
const tasksRoute = require('./routes/tasks')
const authRoutes = require('./routes/auth')
const verifyIt = require('./middlewares/auth')

//Always ensure the routes not using the middleware are above the ones using it! *Important
app.use('/api', authRoutes)
app.use('/api', verifyIt, tasksRoute)

//server fireUp syncing with database connection
const port = process.env.PORT || 4000
const connectDB = require('./database/connectDB')

const start = async()=>{
    try{
        await connectDB(process.env.connectString)
        app.listen(port, ()=>{
            console.log(`Server is fired up on port ${port}`)
        })
    }
    catch (err){
    }
}

start()
module.exports = app;