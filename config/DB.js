const mongoose = require('mongoose')
const url = process.env.DATABASE_URL
mongoose.connect(url).then(()=>{
    console.log('database is connected successfully')
}).catch((error)=>{
    console.log(error.message)
})