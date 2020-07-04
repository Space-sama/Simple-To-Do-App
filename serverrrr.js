const express = require('express')
const app = express()

const connectDB = require('./connection')
connectDB();
const Port =process.env.Port || 9999

app.listen(Port, () => console.log('Port listenning perfectly !'));

app.use('/', (req, res) =>{

    res.send(`Bonjour`)

})