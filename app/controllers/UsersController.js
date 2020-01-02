const router = require('express').Router()
const _ = require('lodash')
const { User } = require('../models/User')
const { authenticateUser } = require('../middlewares/authentication')

// localhost:3005/users/register
router.post('/register', (req,res) => {
  const body = req.body
  const user = new User(body)
  user.save()
    .then(user => res.send(_.pick(user, ['_id', 'username', 'email', 'createdAt'])))
    .catch(err => res.send(err))
})

// localhost:3005/users/login
router.post('/login', (req,res) => {
  const body = req.body
  User.findByCredentials(body.email, body.password)
    .then(user => {
      return user.generateToken()
    })
    .then(token => {
      // res.setHeader('x-auth', token).send({}) - this (header) info cannot be read by axios
      res.send({ token })
      // it is sent in the body as it is easy to read in axios & set in the local storage
    })
    .catch(err => res.send(err))
})

// localhost:3005/users/account
router.get('/account',authenticateUser, (req,res) => {
  const {user} = req
  res.send(_.pick(user, ['_id', 'username', 'email', 'createdAt']))
})

// localhost:3005/users/logout
router.delete('/logout', authenticateUser, (req,res) => {
  const { user, token } = req
  User.findByIdAndUpdate(user._id, { $pull: { tokens: { token: token }}})
    .then(() => res.send({ notice: 'successfully logged out' }))
    .catch(err => res.send(err))
})

module.exports = { usersRouter: router }
