const mongoose = require('mongoose')

mongoose.connect(`mongodb://localhost:27017/react-user-auth`, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
  .then(() => console.log(`connected to DB`) )
  .catch(() => console.log(`error connecting to DB`))

module.exports = {
  mongoose
}