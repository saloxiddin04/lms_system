const express = require('express')
const router = express.Router()
const db = require('../db')
const { authenticate } = require('../middleware/auth')

// get enrollments for current user
router.get('/me', authenticate, async (req,res)=>{
	try {
		const q = await db.query('SELECT e.*, c.title, c.price_cents FROM enrollments e JOIN courses c ON c.id=e.course_id WHERE e.user_id=$1', [req.user.id])
		res.status(200).json(q.rows)
	} catch (e) {
		res.status(500).json({error: e.message})
	}
	
})

module.exports = router