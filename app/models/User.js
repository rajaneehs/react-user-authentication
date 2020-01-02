const mongoose = require('mongoose')
const validatorPkg = require('validator')
const Schema = mongoose.Schema
const bcryptjs= require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new Schema({
  username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
  email: { type: String, required: true, unique: true,
    validate: { 
      validator: function(value){
        return validatorPkg.isEmail(value)
      },
      message: function(){
        return `Invalid email format`
      }
    }
  },
  password: { type: String, required: true, minlength: 6, maxlength: 128 },
  createdAt: { type: Date, default: Date.now()},
  tokens: [
    {
      token: { type: String },
      createdAt: { type: Date, default: Date.now()}
    }
  ]
})

// static method
userSchema.statics.findByCredentials = function(email, password){
  const User = this
  return User.findOne({ email })
            .then(user => {
              if(!user){
                return Promise.reject({ errors: 'Invalid e-mail or password' })
              }
              return bcryptjs.compare(password, user.password)
                      .then(result => {
                        if(result){
                          return Promise.resolve(user)
                        } else {
                          return Promise.reject({ errors: 'Invalid e-mail or password' })
                        }
                      })
            })
            .catch(err => Promise.reject(err))
}

userSchema.statics.findByToken = function(token){
  const User = this
  let tokenData
  try{
    tokenData = jwt.verify(token, 'jwt@123')
  } catch(err){
    return Promise.reject(err)
  }
  return User.findOne({
    _id: tokenData._id,
    'tokens.token': token
  })
}

// own instance method
userSchema.methods.generateToken = function(){
  const user = this
  const tokenData = { 
    _id: user._id,
    username: user.username,
    createdAt: Number(new Date())
  }

  const token = jwt.sign(tokenData, 'jwt@123')
  user.tokens.push({token})   // ES6 object concise property  

  return user.save()
    .then(user => {
      return Promise.resolve(token)
    })
    .catch(err => {
      return Promise.reject(err)
    })
}
 
// pre hooks
userSchema.pre('save', function(next){
  const user = this
  if(user.isNew){
    bcryptjs.genSalt(10)
    .then(salt => {
      bcryptjs.hash(user.password, salt)
        .then(encryptedPwd => {
          user.password = encryptedPwd
          next()
        })
    })
  } else{
      next()
  }
})

const User = mongoose.model('User', userSchema)

module.exports = { User }
