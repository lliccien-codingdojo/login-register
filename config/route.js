const { Router } = require('express')

const {
    loginPostUser,
    loginGetUser,
    registerPostUser,
    registerGetUser } = require('../controllers/user')

const home = require('../controllers/home')

const router = Router()

router.post('/login', loginPostUser)

router.get('/login', loginGetUser)

router.get('/', home)

router.post('/register', registerPostUser)

router.get('/register', registerGetUser)

module.exports = router