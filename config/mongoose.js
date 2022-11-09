const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/usersDb', { useNewUrlParser: true })

module.exports = mongoose