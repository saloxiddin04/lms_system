require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require("path")
const app = express()
const port = process.env.PORT || 8000

app.use(cors())
app.use(bodyParser.json())

app.use('/api/auth', require('./routes/auth'))
app.use('/api/courses', require('./routes/courses'))
app.use('/api/lessons', require('./routes/lessons'))
app.use('/api/chapters', require('./routes/chapters'))
app.use('/api/categories', require('./routes/categories'))
app.use('/api/enrollments', require('./routes/enrollments'))
app.use('/api/payments', require('./routes/payments'))
app.use('/api/admin', require('./routes/admin'))
app.use('/api/dashboard', require('./routes/dashboard'))
app.use("/api/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get('/', (req,res) => res.status(200).json({ ok: true }))

app.listen(port, () => console.log('Server running on', port))