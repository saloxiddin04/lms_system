const express = require("express");
const router = express.Router()
const db = require("../db");
const { authenticate, authorizeRole } = require("../middleware/auth");

// get all chapters with course and category info
router.get("/", authenticate, async (req, res) => {
	try {
		const q = await db.query(`
			SELECT
				ch.id AS chapter_id,
				ch.title AS chapter_title,
				ch.order_index,
				c.id AS course_id,
				c.title AS course_title,
				c.description AS course_description,
				cat.id AS category_id,
				cat.name AS category_name
			FROM chapters ch
			JOIN courses c ON ch.course_id = c.id
			LEFT JOIN categories cat ON c.category_id = cat.id
			ORDER BY c.title, ch.order_index;
		`);
		
		res.status(200).json(q.rows);
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});


// create chapter
router.post("/:courseId/chapters", authenticate, authorizeRole("teacher", "admin"), async (req, res) => {
	try {
		const { courseId } = req.params;
		const { title, order_index } = req.body;
		
		// faqat kurs egasi yoki admin qo‘shishi mumkin
		const courseQ = await db.query("SELECT * FROM courses WHERE id=$1", [courseId]);
		if (!courseQ.rows[0]) return res.status(404).json({ error: "Course not found" });
		
		if (req.user.role !== "admin" && req.user.id !== courseQ.rows[0].teacher_id)
			return res.status(403).json({ error: "Forbidden" });
		
		const q = await db.query(
			`INSERT INTO chapters (course_id, title, order_index) VALUES ($1,$2,$3) RETURNING *`,
			[courseId, title, order_index || 0]
		);
		
		res.status(201).json(q.rows[0]);
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

// update chapter
router.put("/:id", authenticate, authorizeRole("teacher", "admin"), async (req, res) => {
	try {
		const { id } = req.params;
		const { title, order_index } = req.body;
		
		const chapter = await db.query("SELECT * FROM chapters WHERE id=$1", [id]);
		if (!chapter.rows[0]) return res.status(404).json({ error: "Chapter not found" });
		
		const course = await db.query("SELECT * FROM courses WHERE id=$1", [chapter.rows[0].course_id]);
		if (req.user.role !== "admin" && req.user.id !== course.rows[0].teacher_id)
			return res.status(403).json({ error: "Forbidden" });
		
		const q = await db.query(
			`UPDATE chapters SET title=$1, order_index=$2 WHERE id=$3 RETURNING *`,
			[title, order_index, id]
		);
		
		res.status(201).json(q.rows[0]);
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

// delete chapter
router.delete("/:id", authenticate, authorizeRole("teacher", "admin"), async (req, res) => {
	try {
		const { id } = req.params;
		const q = await db.query("DELETE FROM chapters WHERE id=$1 RETURNING *", [id]);
		if (!q.rows[0]) return res.status(404).json({ error: "Chapter not found" });
		res.status(204).json({ ok: true });
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

module.exports = router;
