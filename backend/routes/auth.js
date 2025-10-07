const express = require('express')
const router = express.Router()
const db = require('../db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const SECRET = process.env.JWT_SECRET || 'dev-secret'
const {authenticate} = require('../middleware/auth')
const nodemailer = require('nodemailer')

// email transporter (gmail misol)
const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS
	}
})

// random code generator
function generateCode() {
	return Math.floor(100000 + Math.random() * 900000).toString()
}

router.post('/register', async (req, res) => {
	const {name, email, password, role} = req.body
	if (!email || !password) return res.status(400).json({error: 'Email and password required'})
	try {
		const hashed = await bcrypt.hash(password, 10)
		const finalRole = ['student', 'teacher', 'admin'].includes(role) ? role : 'student'
		const code = generateCode()
		await db.query(
			'INSERT INTO users(name,email,password_hash,role,verify,verification_code) VALUES($1,$2,$3,$4,$5,$6) RETURNING id,name,email,role', [name, email, hashed, finalRole, false, code]
		)
		
		// send verification email
		await transporter.sendMail({
			from: process.env.EMAIL_USER,
			to: email,
			subject: 'Verify your account',
			text: `Your verification code is: ${code}`
		})
		
		res.status(201).json({message: 'User registered. Check your email for verification code.'})
	} catch (err) {
		if (err.code === '23505') return res.status(400).json({error: 'Email exists'})
		console.error(err)
		res.status(500).json({error: 'Server error'})
	}
})

router.post('/verify', async (req, res) => {
	const {email, code} = req.body
	if (!email || !code) return res.status(400).json({error: 'Email and code required'})
	try {
		const q = await db.query('SELECT * FROM users WHERE email=$1', [email])
		const user = q.rows[0]
		if (!user) return res.status(404).json({error: 'User not found'})
		if (user.verify) return res.status(400).json({error: 'Already verified'})
		if (user.verification_code !== code) return res.status(400).json({error: 'Invalid code'})
		
		await db.query('UPDATE users SET verify=true, verification_code=NULL WHERE id=$1', [user.id])
		res.status(200).json({message: 'User verified successfully'})
	} catch (err) {
		console.error(err)
		res.status(500).json({error: 'Server error'})
	}
})

router.post('/resend-verification', async (req, res) => {
	try {
		const { email } = req.body
		if (!email) return res.status(400).json({ error: 'Email required' })
		
		const userQ = await db.query('SELECT * FROM users WHERE email=$1', [email])
		const user = userQ.rows[0]
		
		if (!user) return res.status(404).json({ error: 'User not found' })
		if (user.verify) return res.status(400).json({ error: 'Already verified' })
		
		// yangi kod generatsiya
		const code = Math.floor(100000 + Math.random() * 900000).toString()
		
		// DBga saqlash
		await db.query('UPDATE users SET verification_code=$1 WHERE id=$2', [code, user.id])
		
		// Email yuborish
		await transporter.sendMail({
			from: process.env.EMAIL_USER,
			to: email,
			subject: 'Verify your account',
			text: `Your verification code is: ${code}`
		})
		
		res.status(200).json({ message: 'Verification code resent to email' })
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: 'Server error' })
	}
})

router.post('/login', async (req, res) => {
	const {email, password} = req.body
	if (!email || !password) return res.status(400).json({error: 'Email and password required'})
	try {
		const q = await db.query('SELECT * FROM users WHERE email=$1', [email])
		const user = q.rows[0]
		if (!user) return res.status(401).json({error: 'Invalid credentials'})
		const match = await bcrypt.compare(password, user?.password_hash)
		if (!match) return res.status(401).json({error: 'Invalid credentials'})
		if (!user.verify) return res.status(403).json({error: 'Please verify your email first'})
		
		const token = jwt.sign({
			id: user.id,
			role: user.role,
			name: user.name,
			email: user.email,
			verify: user.verify
		}, SECRET, {expiresIn: '7d'})
		res.status(201).json({token})
	} catch (err) {
		console.error(err);
		res.status(500).json({error: 'Server error'})
	}
})

router.put('/change-password', authenticate, async (req, res) => {
	try {
		const { oldPassword, newPassword } = req.body
		if (!oldPassword || !newPassword) {
			return res.status(400).json({ error: 'Old and new password required' })
		}
		
		// userni olish
		const userQ = await db.query('SELECT * FROM users WHERE id=$1', [req.user.id])
		const user = userQ.rows[0]
		if (!user) return res.status(404).json({ error: 'User not found' })
		
		// eski parolni tekshirish
		const match = await bcrypt.compare(oldPassword, user.password_hash)
		if (!match) return res.status(401).json({ error: 'Old password incorrect' })
		
		// yangi parolni hash qilish
		const hashed = await bcrypt.hash(newPassword, 10)
		await db.query('UPDATE users SET password_hash=$1 WHERE id=$2', [hashed, req.user.id])
		
		res.status(200).json({ message: 'Password updated successfully' })
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: 'Server error' })
	}
})

router.get('/me', authenticate, async (req, res) => {
	try {
		const q = await db.query('SELECT id,name,email,role,verify, created_at FROM users WHERE id=$1', [req.user.id])
		res.status(200).json({user: q.rows[0]})
	} catch (e) {
		res.status(500).json({error: e.message})
	}
})

// profile update
router.put('/me', authenticate, async (req, res) => {
	try {
		const {name} = req.body
		await db.query('UPDATE users SET name=$1 WHERE id=$2', [name, req.user.id])
		const q = await db.query('SELECT id,name,email,role FROM users WHERE id=$1', [req.user.id])
		res.status(201).json({user: q.rows[0]})
	} catch (e) {
		res.status(500).json({error: e.message})
	}
})

module.exports = router