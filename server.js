const express = require('express')
const bodyParse = require('body-parser')

require('./config/mongoose')

const router = require('./config/route')

const app = express()

app.use(bodyParse.urlencoded({ extended: true }))

app.use(express.static(__dirname + '/public'))

app.set('views', __dirname + '/view')

app.set('view engine', 'ejs')

app.use(router)

app.listen(8000, () => {
    console.log('Escuchando en puerto 8000');
})
