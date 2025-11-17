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

function optionalAuth(req, res, next) {
	const authHeader = req.headers.authorization;
	if (!authHeader) return next(); // guest
	
	const token = authHeader.split(" ")[1];
	if (!token) return next();
	
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
	} catch (e) {
		console.log("Invalid token but continuing as guest");
	}
	
	next();
};

function authorizeRole(...allowed) {
	return (req, res, next) => {
		if (!req.user) return res.status(403).json({ error: 'No user' })
		if (!allowed.includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' })
		next()
	}
}

module.exports = { authenticate, authorizeRole, optionalAuth }