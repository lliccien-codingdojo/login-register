const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        require: [true, 'email required'],
        unique: [true, 'email exist'],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/]
    },
    name: { type: String, require: [true, 'name required'] },
    lastName: { type: String, require: [true, 'lastName required'] },
    password: { type: String, require: [true, 'password required'] },
    birthday: { type: Date, require: [true, 'birthday required'] }
}, { timestamps: true })

const User = mongoose.model('User', UserSchema)

module.exports = User