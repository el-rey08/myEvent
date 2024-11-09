require('dotenv').config()
require('./config/DB')
const express = require('express')
const userRouter = require('./router/userRouter')
const eventRouter = require('./router/eventRouter')
const pictureRouter = require('./router/pictureRouter')
const app = express()
const port = process.env.port || 6575
app.use(express.json())
app.use('/api/v1/user', userRouter)
app.use('/api/v1/events', eventRouter)
app.use('/api/v1/picture', pictureRouter)
app.listen(port, ()=>{
    console.log(`app is running on port: ${port}`);
    
})