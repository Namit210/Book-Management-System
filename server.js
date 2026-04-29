const port = process.env.PORT || 4000
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const adminRoutes = require('./controllers/AdminController')
const transactionRoutes = require('./controllers/TransactionController')
const storeRoutes = require('./controllers/StoreController')
const userRoutes = require('./controllers/UserController')
const cors = require('cors')

app.use(cors(
  {
    origin: ['http://localhost:5173', 'https://library-ledger.vercel.app'],
  }
))

const StoreBook = require('./models/StoreSchema')
require('dotenv').config()


mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('Connected to MongoDB')
})
.then(async()=>{
  await StoreBook.syncIndexes()
  console.log('Indexes synchronized')
})
.catch((err) => {
  console.log('Error connecting to MongoDB', err)
})


app.get('/', (req, res) => {
  res.send('Hare Krsna!')
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

app.use(express.json())
app.use('/admin', adminRoutes)
app.use('/transactions', transactionRoutes)
app.use('/store', storeRoutes)
app.use('/user', userRoutes)