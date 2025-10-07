const jwt = require('jsonwebtoken')
const SECRET = process.env.JWT_SECRET || 'dev-secret'

function authenticate(req, res, next) {
	const h = req.headers.authorization
	if (!h) return res.status(401).json({ error: 'No token' })
	const token = h.split(' ')[1]
	try {
		const payload = jwt.verify(token, SECRET)
		req.user = payload
		next()
	} catch (err) {
		return res.status(401).json({ error: 'Invalid token' })
	}
}

function authorizeRole(...allowed) {
	return (req, res, next) => {
		if (!req.user) return res.status(403).json({ error: 'No user' })
		if (!allowed.includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' })
		next()
	}
}

module.exports = { authenticate, authorizeRole }