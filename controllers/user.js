const bcrypt = require('bcrypt')

const User = require('../models/user')

const loginPostUser = (req, res) => {
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

}

const loginGetUser = (req, res) => {
    res.render('login', { error: '' })
}

const registerPostUser = async (req, res) => {
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

}

const registerGetUser = (req, res) => {
    res.render('register', { error: '' })
}


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

module.exports = { loginPostUser, loginGetUser, registerPostUser, registerGetUser }