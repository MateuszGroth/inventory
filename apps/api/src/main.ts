import { productsRouter } from '@org/api-products'
import { storesRouter } from '@org/api-stores'
import express from 'express'

const host = process.env.HOST ?? 'localhost'
const port = process.env.PORT ? Number(process.env.PORT) : 4002

const app = express()

// Middleware
app.use(express.json())

// CORS configuration for React app
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
})

app.get('/', (req, res) => {
  res.send({ message: 'Hello API 3141x' })
})

app.use('/api/stores', storesRouter)
app.use('/api/products', productsRouter)

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`)
})
