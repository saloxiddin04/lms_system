const express = require("express");
const router = express.Router()
const db = require("../db");
const {authenticate, authorizeRole} = require("../middleware/auth");

router.post('/', authenticate, authorizeRole("admin"), async (req, res) => {
	try {
		const {name, slug} = req.body
		
		if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
		
		const q = await db.query(
			`INSERT INTO categories (name, slug) VALUES ($1, $2) RETURNING *`,
			[name, slug]
		)
		
		res.status(201).json(q.rows[0])
	} catch (e) {
		res.status(500).json({error: e.message});
	}
})

router.get('/', async (req, res) => {
	try {
		const q = await db.query(`
			SELECT
				c.*,
				COUNT(co.id) as courses_count
			FROM categories c
			LEFT JOIN courses co ON c.id = co.category
			GROUP BY c.id
			ORDER BY c.created_at DESC;
		`);
		
		res.status(200).json(q.rows);
	} catch (e) {
		res.status(500).json({error: e.message});
	}
});

router.get('/search', authenticate, async (req, res) => {
	try {
		const { q: searchTerm } = req.query;
		let params = [];
		let query = `
			SELECT
				c.*,
				COUNT(co.id) as courses_count
			FROM categories c
			LEFT JOIN courses co ON c.id = co.category
		`;
		
		// Search qismi
		if (searchTerm) {
			query += ` WHERE (c.name ILIKE $1 OR c.slug ILIKE $2)`;
			const term = `%${searchTerm}%`;
			params.push(term, term);
		}
		
		// Group va Order
		query += ` GROUP BY c.id ORDER BY c.created_at DESC`;
		
		const result = await db.query(query, params);
		
		res.status(200).json({
			categories: result.rows,
		});
	} catch (e) {
		res.status(500).json({error: e.message});
	}
});

router.get('/:id', authenticate, authorizeRole("admin", "teacher"), async (req, res) => {
	try {
		const {id} = req.params;
		
		if (req.user.role !== "admin" && req.user.role !== "teacher") return res.status(403).json({ error: "Forbidden" });
		
		const q = await db.query(`SELECT * FROM categories WHERE id = $1;`, [id])
		
		res.status(200).json(q.rows[0])
	} catch (e) {
		res.status(500).json({error: e.message})
	}
})

router.put('/:id', authenticate, authorizeRole("admin", "teacher"), async (req, res) => {
	try {
		const {id} = req.params
		const {name, slug} = req.body
		
		const q = await db.query(
			`UPDATE categories SET name=$1, slug=$2 WHERE id=$3 RETURNING *`,
			[name, slug, id]
		)
		
		if (!q.rows[0]) return res.status(404).json({ error: "Category not found" });
		
		res.status(201).json(q.rows[0]);
	} catch (e) {
		res.status(500).json({error: e.message})
	}
})

router.delete('/:id', authenticate, authorizeRole("admin", "teacher"), async (req, res) => {
	try {
		const {id} = req.params
		const q = await db.query(`SELECT * FROM categories WHERE id=$1`, [id])
		if (!q.rows[0]) return res.status(404).json({error: "Category not found"})
		await db.query(`DELETE FROM categories WHERE id=$1`, [id])
		res.status(204).json({ok: true})
	} catch (e) {
		res.status(500).json({error: e.message})
	}
})

module.exports = router