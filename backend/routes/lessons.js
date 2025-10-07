const express = require('express')
const router = express.Router()
const db = require('../db')
const { authenticate, authorizeRole } = require('../middleware/auth')
const {upload} = require("../middleware/upload")

// create lesson (chapter) inside course
// router.post(
// 	'/:courseId/lessons',
// 	authenticate,
// 	authorizeRole('teacher','admin'),
// 	upload.single('video_url'),
// 	async (req,res)=>{
// 	try {
// 		const { courseId } = req.params
// 		const { title, content, video_url, link, order_index, is_preview } = req.body
// 		// check ownership
// 		const c = await db.query('SELECT * FROM courses WHERE id=$1', [courseId]);
// 		if (!c.rows[0]) return res.status(404).json({ error: 'Course not found' });
// 		if (req.user.role !== 'admin' && req.user.id !== c.rows[0].teacher_id)
// 			return res.status(403).json({ error: 'Forbidden' });
//
// 		const videoPath = req.file ? `/uploads/lessons/${req.file.filename}` : null;
//
// 		const q = await db.query(
// 			`INSERT INTO lessons(course_id, title, content, video_url, link, order_index, is_preview)
//          VALUES ($1,$2,$3,$4,$5,$6,$7)
//          RETURNING *`,
// 			[courseId, title, content, videoPath, link, order_index, is_preview || false]
// 		);
//
// 		res.status(201).json(q.rows[0]);
// 	} catch (e) {
// 		res.status(500).json({error: e.message})
// 	}
// })

router.post(
	'/chapters/:courseId/lessons',
	authenticate,
	authorizeRole('teacher','admin'),
	upload.single('videos'), // bir nechta video
	async (req, res) => {
		try {
			const { chapterId } = req.params;
			const { title, content, link, order_index, is_preview } = req.body;
			
			const videoPath = req.file ? `/uploads/lessons/${req.file.filename}` : null;
			
			const q = await db.query(
				`INSERT INTO lessons (course_id, chapter_id, title, content, video_url, link, order_index, is_preview)
         SELECT c.course_id, $1, $2, $3, $4, $5, $6, $7
         FROM chapters c WHERE c.id = $1
         RETURNING *`,
				[chapterId, title, content, videoPath, link, order_index || 0, is_preview || false]
			);
			
			res.status(201).json(q.rows[0]);
		} catch (e) {
			res.status(500).json({ error: e.message });
		}
	}
);


// update lesson
router.put(
	'/lessons/:id',
	authenticate,
	authorizeRole('teacher', 'admin'),
	upload.single('video_url'),
	async (req, res) => {
		try {
			const { id } = req.params;
			const { title, content, link, order_index, is_preview } = req.body;
			
			// darsni olish
			const lessonQ = await db.query('SELECT * FROM lessons WHERE id=$1', [id]);
			const lesson = lessonQ.rows[0];
			if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
			
			// kursni tekshirish (ownership)
			const courseQ = await db.query('SELECT * FROM courses WHERE id=$1', [
				lesson.course_id
			]);
			const course = courseQ.rows[0];
			if (!course)
				return res.status(404).json({ error: 'Course not found' });
			
			if (
				req.user.role !== 'admin' &&
				req.user.id !== course.teacher_id
			) {
				return res.status(403).json({ error: 'Forbidden' });
			}
			
			let videoPath = lesson.video_url; // eski yo‘lni saqlab turamiz
			
			if (req.file) {
				// eski video bor bo‘lsa o‘chiramiz
				if (lesson.video_url) {
					const oldPath = path.join(process.cwd(), lesson.video_url);
					fs.unlink(oldPath, (err) => {
						if (err) console.warn('Old video not deleted:', err.message);
					});
				}
				// yangi video path
				videoPath = `/uploads/lessons/${req.file.filename}`;
			}
			
			// yangilash
			const q = await db.query(
				`UPDATE lessons
         SET title=$1, content=$2, video_url=$3, link=$4, order_index=$5, is_preview=$6
         WHERE id=$7
         RETURNING *`,
				[
					title || lesson.title,
					content || lesson.content,
					videoPath,
					link || lesson.link,
					order_index ?? lesson.order_index,
					is_preview ?? lesson.is_preview,
					id
				]
			);
			
			res.status(200).json(q.rows[0]);
		} catch (e) {
			res.status(500).json({ error: e.message });
		}
	}
);

// delete
router.delete('/lessons/:id', authenticate, async (req,res)=>{
	try {
		await db.query('DELETE FROM lessons WHERE id=$1', [req.params.id])
		res.status(204).json({ ok:true })
	} catch (e) {
		res.status(500).json({error: e.message})
	}
})

module.exports = router