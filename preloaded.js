const express = require('express')
const app = express()
require('dotenv').config()
const connectDB = require('./database/connectDB')
const data = require('./data.json')

const Pre = require('./models/preloaded')

const port = 5000

const start = async()=>{
    await connectDB(process.env.connectString)
    await Pre.create(data)
    app.listen(port, ()=>{
        console.log('port is fired up and server is hearing on 5000')
    })
}

// start()


