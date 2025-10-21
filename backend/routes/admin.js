const express = require('express')
const router = express.Router()
const db = require('../db')
const {authenticate, authorizeRole} = require('../middleware/auth')
const bcrypt = require("bcryptjs");

router.get('/users', authenticate, authorizeRole('admin'), async (req, res) => {
	try {
		const q = await db.query('SELECT id,name,email,role, verify, created_at FROM users ORDER BY id DESC')
		res.status(200).json(q.rows)
	} catch (e) {
		res.status(500).json({error: e.message})
	}
})

router.get('/users/:id', authenticate, authorizeRole('admin'), async (req, res) => {
	try {
		const {id} = req.params
		
		const q = await db.query('SELECT * FROM users WHERE id=$1', [id])
		
		if (!q.rows[0]) return res.status(404).json({error: "User not found"})
		
		res.status(200).json(q.rows[0])
	} catch (e) {
		res.status(500).json({error: e.message})
	}
})

router.get('/teachers', authenticate, authorizeRole('admin'), async (req, res) => {
	try {
		const q = await db.query("SELECT id, name FROM users WHERE role = 'teacher' ")
		res.status(200).json(q.rows)
	} catch (e) {
		res.status(500).json({error: e.message})
	}
})

router.patch('/users/:id', authenticate, authorizeRole('admin'), async (req, res) => {
	try {
		const {role, name, verify, password} = req.body
		
		const q = await db.query('SELECT id,name,email,role, verify FROM users WHERE id=$1', [req.params.id])
		
		if (!q.rows[0]) return res.status(404).json({error: 'User not found'});
		
		let hashedPassword = null;
		if (password && password.trim() !== '') {
			if (password.length < 6) {
				return res.status(400).json({ error: "Password must be at least 6 characters long" });
			}
			hashedPassword = await bcrypt.hash(password, 10);
		}
		
		await db.query(
			`UPDATE users
       SET role = COALESCE($1, role),
           name = COALESCE($2, name),
           verify = COALESCE($3, verify),
           password_hash = COALESCE($4, password_hash)
       WHERE id = $5`,
			[role, name, verify, hashedPassword, req.params.id]
		);
		res.status(201).json(q.rows[0])
	} catch (e) {
		res.status(500).json({error: e.message})
	}
})

router.delete('/users/:id', authenticate, authorizeRole('admin'), async (req, res) => {
	try {
		await db.query('DELETE FROM users WHERE id=$1', [req.params.id])
		res.status(204).json({ok: true})
	} catch (e) {
		res.status(500).json({error: e.message})
	}
})

module.exports = router