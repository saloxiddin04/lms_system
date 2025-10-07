const express = require('express')
const router = express.Router()
const db = require('../db')
const {authenticate, authorizeRole} = require('../middleware/auth')

// get earnings for teacher
router.get('/teacher/earnings/:teacherId', async (req, res) => {
	const { teacherId } = req.params;
	
	try {
		const result = await db.query(`
      SELECT
        c.id AS course_id,
        c.title AS course_title,
        COALESCE(SUM(p.amount_cents), 0) AS total_earned,
        COUNT(p.id) AS total_sales
      FROM courses c
      JOIN enrollments e ON c.id = e.course_id
      JOIN payments p ON e.course_id = p.course_id AND e.user_id = p.user_id
      WHERE c.teacher_id = $1 AND p.status = 'succeeded'
      GROUP BY c.id, c.title
      ORDER BY total_earned DESC
    `, [teacherId]);
		
		res.status(200).json(result.rows);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Server error fetching teacher earnings' });
	}
});

// get earnings for admin
router.get('/admin/earnings', authenticate, async (req, res) => {
	try {
		const result = await db.query(`
      SELECT
        c.id AS course_id,
        c.title AS course_title,
        u.name AS teacher_name,
        COALESCE(SUM(p.amount_cents), 0) AS total_earned,
        COUNT(p.id) AS total_sales
      FROM courses c
      JOIN users u ON c.teacher_id = u.id
      JOIN enrollments e ON c.id = e.course_id
      JOIN payments p ON e.course_id = p.course_id AND e.user_id = p.user_id
      WHERE p.status = 'succeeded'
      GROUP BY c.id, c.title, u.name
      ORDER BY total_earned DESC
    `);
		
		const totalResult = await db.query(`
      SELECT COALESCE(SUM(amount_cents), 0) AS grand_total
      FROM payments
      WHERE status = 'succeeded'
    `);
		
		res.status(200).json({
			courses: result.rows,
			grand_total: totalResult.rows[0].grand_total
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Server error fetching admin earnings' });
	}
});

// GET /admin/top-teachers
router.get('/top-teachers', authenticate, authorizeRole('admin'), async (req, res) => {
	try {
		const q = await db.query(`
      SELECT
        u.id,
        u.name,
        u.email,
        COUNT(p.id) AS total_sales,
        COALESCE(SUM(p.amount_cents), 0) AS total_earned
      FROM users u
      JOIN courses c ON c.teacher_id = u.id
      JOIN payments p ON p.course_id = c.id AND p.status = 'succeeded'
      WHERE u.role = 'teacher'
      GROUP BY u.id
      ORDER BY total_sales DESC, total_earned DESC
      LIMIT 5
    `);
		
		res.status(200).json(q.rows);
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

// GET /admin/top-students
router.get('/top-students', authenticate, authorizeRole('admin'), async (req, res) => {
	try {
		const q = await db.query(`
      SELECT
        u.id,
        u.name,
        u.email,
        COUNT(p.id) AS total_purchases,
        COALESCE(SUM(p.amount_cents), 0) AS total_spent
      FROM users u
      JOIN payments p ON p.user_id = u.id AND p.status = 'succeeded'
      WHERE u.role = 'student'
      GROUP BY u.id
      ORDER BY total_purchases DESC, total_spent DESC
      LIMIT 5
    `);
		
		res.status(200).json(q.rows);
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});



module.exports = router