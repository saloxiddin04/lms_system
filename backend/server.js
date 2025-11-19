require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require("path")
const app = express()
const port = process.env.PORT || 8000

app.set('etag', false)

app.use(cors())
app.use(bodyParser.json())

app.use((req, res, next) => {
	// Faqat API GET so'rovlari uchun
	if (req.originalUrl.startsWith('/api/') && req.method === 'GET') {
		res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate')
		res.setHeader('Pragma', 'no-cache')
		res.setHeader('Expires', '0')
	}
	next()
})

app.use('/api/auth', require('./routes/auth'))
app.use('/api/courses', require('./routes/courses'))
app.use('/api/lessons', require('./routes/lessons'))
app.use('/api/categories', require('./routes/categories'))
app.use('/api/enrollments', require('./routes/enrollments'))
app.use('/api/payments', require('./routes/payments'))
app.use('/api/admin', require('./routes/admin'))
app.use('/api/dashboard', require('./routes/dashboard'))
app.use("/api/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get('/', (req,res) => res.status(200).json({ ok: true }))

app.listen(port, () => console.log('Server running on', port))