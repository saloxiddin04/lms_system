const express = require('express')
const router = express.Router()
const db = require('../db')
const {authenticate, authorizeRole} = require('../middleware/auth')

router.get(
	"/teacher",
	authenticate,
	authorizeRole("teacher", "admin"),
	async (req, res) => {
		try {
			const teacherId = req.user.id;
			
			const totalCourses = await db.query(
				"SELECT COUNT(*) FROM courses WHERE teacher = $1",
				[teacherId]
			);
			
			const totalStudents = await db.query(`
        SELECT COUNT(*)
        FROM enrollments e
        JOIN courses c ON c.id = e.course_id
        WHERE c.teacher = $1 AND e.paid = true
      `, [teacherId]);
			
			const revenue = await db.query(`
        SELECT COALESCE(SUM(amount_cents), 0) AS total
        FROM payments
        WHERE course_id IN (SELECT id FROM courses WHERE teacher = $1)
          AND status = 'succeeded'
      `, [teacherId]);
			
			const topCourses = await db.query(`
        SELECT
          c.id,
          c.title,
          COUNT(e.id) AS total_students
        FROM enrollments e
        JOIN courses c ON c.id = e.course_id
        WHERE c.teacher = $1
        GROUP BY c.id
        ORDER BY total_students DESC
        LIMIT 5
      `, [teacherId]);
			
			res.status(200).json({
				totalCourses: Number(totalCourses.rows[0].count),
				totalStudents: Number(totalStudents.rows[0].count),
				totalRevenue: Number(revenue.rows[0].total),
				topCourses: topCourses.rows
			});
			
		} catch (e) {
			console.error(e);
			res.status(500).json({ error: e.message });
		}
	}
);

// get earnings for teacher
router.get('/teacher/earnings', authenticate, authorizeRole("teacher"), async (req, res) => {
	const {id} = req.user;
	
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
    `, [id]);
		
		res.status(200).json(result.rows);
	} catch (err) {
		console.error(err);
		res.status(500).json({error: 'Server error fetching teacher earnings'});
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
      JOIN users u ON c.teacher = u.id
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
		res.status(500).json({error: 'Server error fetching admin earnings'});
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
      JOIN courses c ON c.teacher = u.id
      JOIN payments p ON p.course_id = c.id AND p.status = 'succeeded'
      WHERE u.role = 'teacher'
      GROUP BY u.id
      ORDER BY total_sales DESC, total_earned DESC
      LIMIT 5
    `);
		
		res.status(200).json(q.rows);
	} catch (e) {
		res.status(500).json({error: e.message});
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
		res.status(500).json({error: e.message});
	}
});


// GET /student/my-courses
router.get('/my-courses', authenticate, async (req, res) => {
	try {
		const userId = req.user.id;
		
		// Enrollment orqali kurslarni olish
		const enrollmentsQ = await db.query(
			`SELECT
				e.*,
				c.*,
				u.name as teacher_name,
				cat.name as category_name,
				(SELECT COUNT(*) FROM lessons l WHERE l.course_id = c.id AND l.is_published = true) as total_lessons,
				(SELECT COUNT(*) FROM lessons l WHERE l.course_id = c.id AND l.is_completed = true) as completed_lessons
			FROM enrollments e
			JOIN courses c ON e.course_id = c.id
			JOIN users u ON c.teacher = u.id
			LEFT JOIN categories cat ON c.category = cat.id
			WHERE e.user_id = $1 AND c.published = true
			ORDER BY e.enrolled_at DESC`,
			[userId]
		);
		
		const courses = enrollmentsQ.rows.map(enrollment => {
			const progress = enrollment.progress || {};
			const completedCount = Object.keys(progress).length;
			const totalLessons = enrollment.total_lessons || 0;
			const percent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
			
			return {
				id: enrollment.course_id,
				title: enrollment.title,
				description: enrollment.description,
				preview_image: enrollment.preview_image,
				teacher_name: enrollment.teacher_name,
				category_name: enrollment.category_name,
				price_cents: enrollment.price_cents,
				currency: enrollment.currency,
				enrolled_at: enrollment.enrolled_at,
				progress: progress,
				progress_percent: percent,
				completed_lessons: completedCount,
				total_lessons: totalLessons,
				paid: enrollment.paid
			};
		});
		
		res.status(200).json({
			success: true,
			courses: courses
		});
		
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: e.message });
	}
});

module.exports = router