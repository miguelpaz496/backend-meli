const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
dotenv.config()
const app = express()

const port = process.env.PORT || 3000

// Cors
app.use(cors())

// Router
const routerItems = require('./routers/items')
app.use('/api/items', routerItems)

app.get('/api/', (req, res) => {
  res.send('Api para la prueba tecnica')
})

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})