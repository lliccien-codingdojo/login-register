const express = require('express')
const bodyParse = require('body-parser')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const mongooseValidator = require('mongoose-validator')

const app = express()

app.use(bodyParse.urlencoded({ extended: true }))

app.use(express.static(__dirname + '/public'))

app.set('views', __dirname + '/view')

app.set('view engine', 'ejs')

mongoose.connect('mongodb://localhost/usersDb', { useNewUrlParser: true })

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

app.post('/login', (req, res) => {
    const { email, password } = req.body
    User.find({ email: email })
        .then(
            async (user) => {
                if (user.length === 0) {
                    res.render('login', { error: "user no found" })
                }

                const storePassword = user[0].password

                const validPassword = await comparePassword(password, storePassword)

                if (validPassword) {
                    res.redirect('/')
                } else {
                    res.render('login', { error: "password no found" })
                }

            }
        )
        .catch(
            (error) => {
                console.log("error", error);
                res.render('login', { error: handleError(error) })
            }
        )

})

app.get('/login', (req, res) => {
    res.render('login', { error: '' })
})

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/register', async (req, res) => {
    const { email, password, name, lastName, birthday } = req.body
    const user = new User()
    user.email = email
    user.password = await encryptPassword(password)
    user.name = name
    user.lastName = lastName
    user.birthday = birthday
    user.save()
        .then(
            () => res.redirect('/login')
        )
        .catch(
            (error) => {
                res.render('register', { error: handleError(error) })
            },

        )

})

app.get('/register', (req, res) => {

    res.render('register', { error: '' })
})

app.listen(8000, () => {
    console.log('Escuchando en puerto 8000');
})


function handleError(error) {
    if (error.code === 11000) {
        return `Email duplicate: ${error.keyValue.email}`
    } else if (error.errors.email.path === 'email') {
        return `Email invalid: ${error.errors.email.value} `
    } else {
        console.log(error);
        return error
    }
}

async function encryptPassword(password) {
    return await bcrypt.hash(password, 10)
}

async function comparePassword(formPassword, storePassword) {
    return await bcrypt.compare(formPassword, storePassword)
}