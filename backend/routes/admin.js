const express = require('express')
const router = express.Router()
const db = require('../db')
const {authenticate, authorizeRole} = require('../middleware/auth')

router.get('/users', authenticate, authorizeRole('admin'), async (req, res) => {
	try {
		const q = await db.query('SELECT id,name,email,role, verify, created_at FROM users ORDER BY id DESC')
		res.status(200).json(q.rows)
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
		const {role, name, verify} = req.body
		await db.query('UPDATE users SET role=COALESCE($1,role), name=COALESCE($2,name), verify=COALESCE($3, verify) WHERE id=$4', [role, name, verify, req.params.id])
		const q = await db.query('SELECT id,name,email,role, verify FROM users WHERE id=$1', [req.params.id])
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