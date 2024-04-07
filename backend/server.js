const express = require('express')
const color = require('colors')
const connectDB = require('./config/db')
const {errorHandler} = require('./middleware/errorMiddleware')

// Bringing in the dotenv package we installed
const dotenv = require('dotenv').config()
const PORT = process.env.PORT ||5000
// connect to db

connectDB()
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:false}))
// create a route
app.get('/',(req,res)=>{
    // res.send('hello')
    res.json({
        message: 'Welcome to the support de'
    })
})

// Routes
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/tickets', require('./routes/ticketRoutes'))
app.use(errorHandler)

app.listen(PORT,()=>console.log(`Server started on port ${PORT}`))