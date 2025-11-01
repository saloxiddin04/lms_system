const express = require('express')
const router = express.Router()
const db = require('../db')
const {authenticate, authorizeRole} = require('../middleware/auth')
const {upload} = require("../middleware/upload")

router.get("/:id", authenticate, async (req, res) => {
	try {
		const {id} = req.params;
		
		const lessonQ = await db.query(`
			SELECT * FROM lessons WHERE id=$1
		`, [id])
		
		if (!lessonQ.rows[0]) return res.status(404).json({ error: 'Lesson not found' });
		
		res.status(200).json({
			...lessonQ.rows[0]
		})
	} catch (e) {
		res.status(500).json({error: e.message});
	}
})

router.post(
	'/:courseId/lesson',
	authenticate,
	authorizeRole('teacher', 'admin'),
	upload.fields([{name: 'lessonsVideo', maxCount: 50}]), // bir nechta video
	async (req, res) => {
		try {
			const {courseId} = req.params;
			const {title, content, link, order_index, is_preview, is_published} = req.body;
			const files = req.files;
			
			const lessonQ = await db.query(
				`INSERT INTO lessons(title, content, link, order_index, is_preview, is_published, video_url, course_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
				[
					title,
					content,
					link,
					order_index,
					is_preview || false,
					is_published || false,
					files?.lessonsVideo ? `/uploads/lessons/${files.lessonsVideo[0].filename}` : null,
					courseId
				]
			)
			
			res.status(201).json({
				message: "Lesson created successfully!",
				lesson: lessonQ.rows[0]
			})
			
			// const lessonsArr = typeof lessons === 'string' ? JSON.parse(lessons) : lessons;
			
			// if (!files?.lessonsVideo) return res.status(400).json({ error: 'Lessons video is required' });
			
			// let videoIndex = 0;
			// for (let i = 0; i < lessonsArr.length; i++) {
			// 	const les = lessonsArr[i];
			// 	let videoPath = null;
			//
			// 	if (files.lessonsVideo && files.lessonsVideo[videoIndex]) {
			// 		videoPath = `/uploads/lessons/${files.lessonsVideo[videoIndex].filename}`;
			// 		videoIndex++;
			// 	}
			//
			// 	await db.query(
			// 		`INSERT INTO lessons (course_id, title, content, link, order_index, is_preview, is_published, video_url)
			//      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
			// 		[
			// 			courseId,
			// 			les.title,
			// 			les.content,
			// 			les.link,
			// 			les.order_index || i + 1,
			// 			les.is_preview || false,
			// 			les.is_published || false,
			// 			videoPath
			// 		]
			// 	);
			// }
			//
			// res.status(201).json({
			// 	message: "Lessons created successfully"
			// });
		} catch (e) {
			res.status(500).json({error: e.message});
		}
	}
);

// router.patch(
// 	"/:id",
// 	authenticate,
// 	authorizeRole("admin", "teacher"),
// 	upload.fields([{name: "lessonsVideo", maxCount: 50}]),
// 	async (req, res) => {
// 		try {
// 			const {id} = req.params;
// 			const updates = req.body;
//
// 			if (req.file) {
// 				updates.lessonsVideo = `/uploads/lessons/${req.file.filename}`;
// 			}
// 		} catch (e) {
// 			res.status(500).json({error: e.message});
// 		}
// 	}
// )


router.put(
	"/:courseId/lesson/reorder",
	authenticate,
	authorizeRole("admin", "teacher"),
	async (req, res) => {
		try {
			const {courseId} = req.params;
			const lessons = req.body;
			
			if (!Array.isArray(lessons) || lessons.length === 0) {
				return res.status(400).json({error: "Invalid lessons data"});
			}
			
			// 🔁 Har bir lesson uchun tartibni yangilaymiz
			const updatePromises = lessons.map((lesson) => {
				return db.query(
					`UPDATE lessons
           SET order_index = $1
           WHERE id = $2 AND course_id = $3`,
					[lesson.order_index, lesson.id, courseId]
				);
			});
			
			await Promise.all(updatePromises);
			
			res.status(200).json({message: "Lessons reordered successfully"});
		} catch (e) {
			console.error("Lesson reorder error:", e);
			res.status(500).json({error: e.message});
		}
	}
);

// update lesson
router.patch(
	'/:id',
	authenticate,
	authorizeRole('teacher', 'admin'),
	upload.single('lessonsVideo'),
	async (req, res) => {
		try {
			const {id} = req.params;
			const {title, content, link, order_index, is_preview} = req.body;
			
			// darsni olish
			const lessonQ = await db.query('SELECT * FROM lessons WHERE id=$1', [id]);
			const lesson = lessonQ.rows[0];
			if (!lesson) return res.status(404).json({error: 'Lesson not found'});
			
			// kursni tekshirish (ownership)
			const courseQ = await db.query('SELECT * FROM courses WHERE id=$1', [
				lesson.course_id
			]);
			const course = courseQ.rows[0];
			if (!course)
				return res.status(404).json({error: 'Course not found'});
			
			if (
				req.user.role !== 'admin' &&
				req.user.id !== course.teacher_id
			) {
				return res.status(403).json({error: 'Forbidden'});
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
			res.status(500).json({error: e.message});
		}
	}
);

// delete
router.delete('/lessons/:id', authenticate, async (req, res) => {
	try {
		await db.query('DELETE FROM lessons WHERE id=$1', [req.params.id])
		res.status(204).json({ok: true})
	} catch (e) {
		res.status(500).json({error: e.message})
	}
})

module.exports = router