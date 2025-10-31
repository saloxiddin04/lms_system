// const express = require('express')
// const router = express.Router()
// const db = require('../db')
// const {authenticate, authorizeRole} = require('../middleware/auth')
// const {upload, deleteFiles} = require('../middleware/upload.js')
//
// // list (published)
// router.get('/', authenticate, async (req, res) => {
// 	try {
// 		let q;
//
// 		if (req.user.role === 'teacher') {
// 			// faqat teacherning o'zi yaratgan kurslari
// 			q = await db.query(
// 				`SELECT c.*,
//                 json_build_object(
//                   'id', u.id,
//                   'name', u.name,
//                   'email', u.email,
//                   'role', u.role
//                 ) AS teacher
//          FROM courses c
//          JOIN users u ON c.teacher_id = u.id
//          WHERE c.teacher_id = $1
//          ORDER BY c.created_at DESC`,
// 				[req.user.id]
// 			);
// 		} else if (req.user.role === 'admin') {
// 			// admin barcha kurslarni ko'radi
// 			q = await db.query(
// 				`SELECT c.*,
//         json_build_object(
//             'id', u.id,
//             'name', u.name,
//             'email', u.email,
//             'role', u.role
//         ) AS teacher,
//         CASE
//             WHEN cat.id IS NOT NULL THEN
//                 json_build_object(
//                     'id', cat.id,
//                     'name', cat.name,
//                     'slug', cat.slug
//                 )
//             ELSE NULL
// 		        END AS category
// 				    FROM courses c
// 				    JOIN users u ON c.teacher_id = u.id
// 				    LEFT JOIN categories cat ON c.category_id = cat.id
// 				    ORDER BY c.created_at DESC`
// 			);
// 		} else {
// 			// student faqat published = true bo'lganlarini ko'radi
// 			q = await db.query(
// 				`SELECT c.*,
//                 json_build_object(
//                   'id', u.id,
//                   'name', u.name,
//                   'email', u.email,
//                   'role', u.role
//                 ) AS teacher
//          FROM courses c
//          JOIN users u ON c.teacher_id = u.id
//          WHERE c.published = true
//          ORDER BY c.created_at DESC`
// 			);
// 		}
//
// 		res.status(200).json(q.rows);
// 	} catch (e) {
// 		console.error(e);
// 		res.status(500).json({error: e.message});
// 	}
// });
//
// router.get('/:id', authenticate, async (req, res) => {
// 	try {
// 		const {id} = req.params;
//
// 		// 1️⃣ Kurs va teacher + category ma'lumotlari
// 		const courseQ = await db.query(`
//       SELECT c.id,
//              c.title,
//              c.description,
//              c.price_cents,
//              c.currency,
//              c.published,
//              c.created_at,
//              c.preview_image,
//              u.id as teacher_id,
//              u.name as teacher_name,
//              u.email as teacher_email,
//              cat.id as category_id,
//              cat.name as category_name,
//              cat.slug as category_slug
//       FROM courses c
//       LEFT JOIN users u ON c.teacher_id = u.id
//       LEFT JOIN categories cat ON c.category_id = cat.id
//       WHERE c.id = $1
//     `, [id]);
//
// 		if (!courseQ.rows[0]) {
// 			return res.status(404).json({error: 'Course not found'});
// 		}
//
// 		const course = courseQ.rows[0];
//
// 		// 2️⃣ Enrollment tekshirish (student bo‘lsa)
// 		let enrolled = false;
// 		let progress = {};
// 		if (req.user && req.user.role === 'student') {
// 			const enrQ = await db.query(
// 				'SELECT paid, progress FROM enrollments WHERE user_id=$1 AND course_id=$2',
// 				[req.user.id, course.id]
// 			);
// 			if (enrQ.rows[0] && enrQ.rows[0].paid) {
// 				enrolled = true;
// 				progress = enrQ.rows[0].progress || {};
// 			}
// 		}
//
// 		// 3️⃣ Chapters va Lessons olish
// 		const chaptersQ = await db.query(`
//       SELECT ch.id as chapter_id, ch.title as chapter_title, ch.order_index as chapter_order,
//              l.id as lesson_id, l.title as lesson_title, l.content, l.video_url, l.link, l.order_index as lesson_order, l.is_preview
//       FROM chapters ch
//       LEFT JOIN lessons l ON l.chapter_id = ch.id
//       WHERE ch.course_id = $1
//       ORDER BY ch.order_index, l.order_index
//     `, [id]);
//
// 		// 4️⃣ Chapters va Lessons ni nested JSON formatga o'tkazish
// 		const chaptersMap = {};
// 		chaptersQ.rows.forEach(row => {
// 			if (!chaptersMap[row.chapter_id]) {
// 				chaptersMap[row.chapter_id] = {
// 					id: row.chapter_id,
// 					title: row.chapter_title,
// 					order_index: row.chapter_order,
// 					lessons: []
// 				};
// 			}
//
// 			if (row.lesson_id) {
// 				// Sotib olgan bo‘lsa barcha lessonlar, aks holda faqat preview
// 				if (enrolled || row.is_preview) {
// 					chaptersMap[row.chapter_id].lessons.push({
// 						id: row.lesson_id,
// 						title: row.lesson_title,
// 						content: row.content,
// 						video_url: row.video_url,
// 						link: row.link,
// 						order_index: row.lesson_order,
// 						is_preview: row.is_preview
// 					});
// 				}
// 			}
// 		});
//
// 		const chapters = Object.values(chaptersMap);
//
// 		// 5️⃣ Response
// 		res.status(200).json({
// 			id: course.id,
// 			title: course.title,
// 			description: course.description,
// 			price_cents: course.price_cents,
// 			currency: course.currency,
// 			published: course.published,
// 			preview_image: course.preview_image,
// 			teacher: {
// 				id: course.teacher_id,
// 				name: course.teacher_name,
// 				email: course.teacher_email
// 			},
// 			category: {
// 				id: course.category_id,
// 				name: course.category_name,
// 				slug: course.category_slug
// 			},
// 			enrolled,
// 			progress,
// 			chapters
// 		});
//
// 	} catch (e) {
// 		res.status(500).json({error: e.message});
// 	}
// });
//
// router.post(
// 	"/full",
// 	authenticate,
// 	authorizeRole("teacher", "admin"),
// 	upload.fields([
// 		{name: "preview", maxCount: 1},
// 		{name: "lessonsVideo", maxCount: 20}
// 	]),
// 	async (req, res) => {
// 		try {
// 			const {title, description, price_cents, currency, chapters, category_id, teacher_id} = req.body;
//
// 			// Admin uchun teacher_id ni tekshirish
// 			let finalTeacherId;
// 			if (req.user.role === "admin" && teacher_id) {
// 				// Admin boshqa teacher uchun course yaratmoqchi
// 				finalTeacherId = teacher_id;
// 			} else {
// 				// Teacher o'zi uchun yaratmoqchi
// 				finalTeacherId = req.user.id;
// 			}
//
// 			// Category tekshirish
// 			if (!category_id) {
// 				return res.status(400).json({error: "Category is required"});
// 			}
//
// 			const chaptersArr = typeof chapters === "string" ? JSON.parse(chapters) : chapters;
// 			const files = req.files;
//
// 			console.log("Received files:", files);
//
// 			// 1️⃣ Course yaratish (endi category_id ham qo'shildi)
// 			const courseQ = await db.query(
// 				`INSERT INTO courses
//          (title, description, teacher_id, category_id, price_cents, currency, published, preview_image)
//          VALUES ($1,$2,$3,$4,$5,$6,false,$7) RETURNING *`,
// 				[
// 					title,
// 					description,
// 					finalTeacherId, // 🔥 Yangi teacher_id
// 					category_id,    // 🔥 Yangi category_id
// 					price_cents || 0,
// 					currency || "usd",
// 					files.preview ? `/uploads/courses/${files.preview[0].filename}` : null
// 				]
// 			);
// 			const course = courseQ.rows[0];
//
// 			// 2️⃣ Chapters + Lessons (oldingi kabi)
// 			let videoIndex = 0;
//
// 			for (let i = 0; i < chaptersArr.length; i++) {
// 				const ch = chaptersArr[i];
// 				const chapterQ = await db.query(
// 					`INSERT INTO chapters (course_id, title, order_index)
//            VALUES ($1,$2,$3) RETURNING *`,
// 					[course.id, ch.title, ch.order_index || i + 1]
// 				);
// 				const chapter = chapterQ.rows[0];
//
// 				if (ch.lessons && Array.isArray(ch.lessons)) {
// 					for (let j = 0; j < ch.lessons.length; j++) {
// 						const les = ch.lessons[j];
// 						let videoPath = null;
//
// 						if (files.lessonsVideo && files.lessonsVideo[videoIndex]) {
// 							videoPath = `/uploads/lessons/${files.lessonsVideo[videoIndex].filename}`;
// 							videoIndex++;
// 						}
//
// 						await db.query(
// 							`INSERT INTO lessons
//                (course_id, chapter_id, title, content, link, order_index, is_preview, video_url)
//                VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
// 							[
// 								course.id,
// 								chapter.id,
// 								les.title,
// 								les.content,
// 								les.link,
// 								les.order_index || j + 1,
// 								false,
// 								videoPath
// 							]
// 						);
// 					}
// 				}
// 			}
//
// 			res.status(201).json({
// 				message: "Course with chapters, lessons, videos created successfully",
// 				courseId: course.id,
// 				chapters: chaptersArr.length,
// 				lessons: chaptersArr.reduce((acc, ch) => acc + (ch.lessons?.length || 0), 0),
// 				videosUploaded: videoIndex
// 			});
// 		} catch (err) {
// 			console.error("Course creation error:", err);
// 			res.status(500).json({error: err.message});
// 		}
// 	}
// );
//
// router.put(
// 	'/:id',
// 	authenticate,
// 	authorizeRole('teacher', 'admin'),
// 	upload.single('preview'),
// 	async (req, res) => {
// 		try {
// 			const {
// 				title,
// 				description,
// 				category_id,
// 				price_cents,
// 				currency,
// 				published
// 			} = req.body;
//
// 			const previewImage = req.file
// 				? `/uploads/courses/${req.file.filename}`
// 				: null;
//
// 			const q = await db.query(
// 				`UPDATE courses
//          SET title=$1,
//              description=$2,
//              category_id=$3,
//              price_cents=$4,
//              currency=$5,
//              preview_image=COALESCE($6, preview_image),
//              published=$7
//          WHERE id=$8
//          RETURNING *`,
// 				[
// 					title,
// 					description,
// 					category_id,
// 					price_cents,
// 					currency,
// 					previewImage,
// 					published,
// 					req.params.id
// 				]
// 			);
//
// 			res.status(201).json(q.rows[0]);
// 		} catch (e) {
// 			res.status(500).json({error: e.message});
// 		}
// 	}
// );
//
//
// // PUT /courses/:id/progress
// router.put('/:id/progress', authenticate, async (req, res) => {
// 	try {
// 		const {id} = req.params; // course_id
// 		const userId = req.user.id;
// 		const {lessonId, completed} = req.body;
//
// 		// enrollment borligini tekshirish
// 		const enrollmentQ = await db.query(
// 			'SELECT * FROM enrollments WHERE user_id=$1 AND course_id=$2',
// 			[userId, id]
// 		);
//
// 		const enrollment = enrollmentQ.rows[0];
// 		if (!enrollment) return res.status(404).json({error: 'Enrollment not found'});
//
// 		// eski progressni olish
// 		const currentProgress = enrollment.progress || {};
//
// 		// yangi progress qo‘shish / yangilash
// 		currentProgress[lessonId] = completed;
//
// 		// DB yangilash
// 		await db.query(
// 			'UPDATE enrollments SET progress=$1 WHERE id=$2',
// 			[currentProgress, enrollment.id]
// 		);
//
// 		// kursdagi darslarni olish
// 		const lessonsQ = await db.query('SELECT id FROM lessons WHERE course_id=$1', [id]);
// 		const totalLessons = lessonsQ.rows.length;
//
// 		// nechta tugallanganini hisoblash
// 		const completedLessons = Object.values(currentProgress).filter(v => v).length;
// 		const percent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
//
// 		res.status(200).json({
// 			message: 'Progress updated',
// 			progress: currentProgress,
// 			completedLessons,
// 			totalLessons,
// 			percent
// 		});
// 	} catch (e) {
// 		res.status(500).json({error: e.message});
// 	}
// });
//
// router.patch('/:id/publish', authenticate, authorizeRole('admin'), async (req, res) => {
// 	try {
// 		const {published} = req.body;
// 		const q = await db.query(
// 			`UPDATE courses SET published=$1 WHERE id=$2 RETURNING *`,
// 			[published, req.params.id]
// 		);
// 		res.json(q.rows[0]);
// 	} catch (e) {
// 		res.status(500).json({error: e.message});
// 	}
// });
//
//
// // delete
// // router.delete('/:id', authenticate, async (req, res) => {
// // 	try {
// // 		const {id} = req.params
// // 		const courseQ = await db.query('SELECT * FROM courses WHERE id=$1', [id])
// // 		const course = courseQ.rows[0]
// // 		if (!course) return res.status(404).json({error: 'Not found'})
// // 		if (req.user.role !== 'admin' && req.user.id !== course.teacher_id) return res.status(403).json({error: 'Forbidden'})
// // 		await db.query('DELETE FROM courses WHERE id=$1', [id])
// // 		res.status(204).json({ok: true})
// // 	} catch (e) {
// // 		res.status(500).json({error: e.message})
// // 	}
// // })
//
// router.delete('/:id', authenticate, async (req, res) => {
// 	try {
// 		const {id} = req.params;
//
// 		// Course mavjudligini va egasini tekshirish
// 		const courseQ = await db.query(`
//             SELECT c.*, u.role as teacher_role
//             FROM courses c
//             JOIN users u ON c.teacher_id = u.id
//             WHERE c.id = $1
//         `, [id]);
//
// 		const course = courseQ.rows[0];
//
// 		if (!course) {
// 			return res.status(404).json({error: 'Course not found'});
// 		}
//
// 		// Authorization tekshirish
// 		if (req.user.role !== 'admin' && req.user.id !== course.teacher_id) {
// 			return res.status(403).json({error: 'Forbidden'});
// 		}
//
// 		// O'chiriladigan fayllarni ro'yxatini olish
// 		const filesToDelete = [];
//
// 		// Preview image
// 		if (course.preview_image) {
// 			filesToDelete.push(course.preview_image);
// 		}
//
// 		// Lesson videolarini olish
// 		const lessonsVideosQ = await db.query(
// 			'SELECT video_url FROM lessons WHERE course_id = $1 AND video_url IS NOT NULL',
// 			[id]
// 		);
//
// 		lessonsVideosQ.rows.forEach(lesson => {
// 			if (lesson.video_url) {
// 				filesToDelete.push(lesson.video_url);
// 			}
// 		});
// 		await db.query('DELETE FROM courses WHERE id = $1', [id]);
//
// 		// Fayllarni fizik o'chirish
// 		await deleteFiles(filesToDelete);
//
// 		res.status(204).json({
// 			ok: true,
// 		});
// 	} catch (e) {
// 		console.error('Course deletion error:', e);
// 		res.status(500).json({error: e.message});
// 	}
// });
//
// module.exports = router

const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate, authorizeRole } = require('../middleware/auth');
const { upload, deleteFiles } = require('../middleware/upload.js');

/**
 * GET /courses
 * Teacher – o‘z kurslari
 * Admin – hamma kurslar
 * Student – faqat published kurslar
 */
router.get('/', authenticate, async (req, res) => {
	try {
		let q;
		
		if (req.user.role === 'teacher') {
			q = await db.query(
				`SELECT c.*, json_build_object(
            'id', u.id, 'name', u.name, 'email', u.email, 'role', u.role
          ) AS teacher
         FROM courses c
         JOIN users u ON c.teacher = u.id
         WHERE c.teacher_id = $1
         ORDER BY c.created_at DESC`,
				[req.user.id]
			);
		} else if (req.user.role === 'admin') {
			q = await db.query(
				`SELECT c.*,
            json_build_object('id', u.id, 'name', u.name, 'email', u.email, 'role', u.role) AS teacher,
            CASE WHEN cat.id IS NOT NULL THEN json_build_object('id', cat.id, 'name', cat.name, 'slug', cat.slug)
                 ELSE NULL END AS category
         FROM courses c
         JOIN users u ON c.teacher = u.id
         LEFT JOIN categories cat ON c.category = cat.id
         ORDER BY c.created_at DESC`
			);
		} else {
			q = await db.query(
				`SELECT c.*, json_build_object(
            'id', u.id, 'name', u.name, 'email', u.email, 'role', u.role
          ) AS teacher
         FROM courses c
         JOIN users u ON c.teacher = u.id
         WHERE c.published = true
         ORDER BY c.created_at DESC`
			);
		}
		
		res.status(200).json(q.rows);
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: e.message });
	}
});

/**
 * GET /courses/:id
 * Kurs ma'lumotlari + lessons[]
 */
router.get('/:id', authenticate, async (req, res) => {
	try {
		const { id } = req.params;
		
		// 🧩 Kurs ma'lumotini olish
		const courseQ = await db.query(`
      SELECT c.*,
             u.id AS teacher, u.name AS teacher_name, u.email AS teacher_email,
             cat.id AS category, cat.name AS category_name, cat.slug AS category_slug
      FROM courses c
      LEFT JOIN users u ON c.teacher = u.id
      LEFT JOIN categories cat ON c.category = cat.id
      WHERE c.id = $1
    `, [id]);
		
		if (!courseQ.rows[0]) return res.status(404).json({ error: 'Course not found' });
		const course = courseQ.rows[0];
		
		let enrolled = false;
		let progress = {};
		
		// 👨‍🎓 Student uchun enrollment tekshiruvi
		if (req.user && req.user.role === 'student') {
			const enrQ = await db.query(
				'SELECT paid, progress FROM enrollments WHERE user_id = $1 AND course_id = $2',
				[req.user.id, course.id]
			);
			if (enrQ.rows[0]?.paid) {
				enrolled = true;
				progress = enrQ.rows[0].progress || {};
			}
		}
		
		// 📚 Darslarni olish
		const lessonsQ = await db.query(`
      SELECT id, title, content, video_url, link, order_index, is_preview, is_published
      FROM lessons
      WHERE course_id = $1
      ORDER BY order_index ASC
    `, [id]);
		
		const allLessons = lessonsQ.rows;
		
		let visibleLessons = [];
		
		// 🎯 Rollarga qarab darslarni filtrlash
		if (req.user.role === 'admin') {
			// Admin hammasini ko‘radi
			visibleLessons = allLessons;
		} else if (req.user.role === 'teacher' && course.teacher_id === req.user.id) {
			// Faqat shu kursning o‘qituvchisi bo‘lsa, hammasini ko‘radi
			visibleLessons = allLessons;
		} else if (req.user.role === 'student') {
			if (enrolled) {
				// To‘lov qilgan bo‘lsa — hammasi ko‘rinadi
				visibleLessons = allLessons;
			} else {
				// To‘lov qilmagan bo‘lsa — faqat preview va published darslar
				visibleLessons = allLessons.filter(l => l.is_preview && l.is_published);
			}
		} else {
			// Guest foydalanuvchi (authenticate bor, lekin fallback uchun)
			visibleLessons = allLessons.filter(l => l.is_preview && l.is_published);
		}
		
		res.status(200).json({
			...course,
			teacher: {
				id: course.teacher,
				name: course.teacher_name,
				email: course.teacher_email,
			},
			category: {
				id: course.category,
				name: course.category_name,
				slug: course.category_slug,
			},
			enrolled,
			progress,
			lessons: visibleLessons,
		});
		
	} catch (e) {
		console.error('Course GET error:', e);
		res.status(500).json({ error: e.message });
	}
});

/**
 * POST /courses/full
 * Course + lessons yaratish
 */
router.post(
	'/full',
	authenticate,
	authorizeRole('teacher', 'admin'),
	upload.fields([
		{ name: 'preview', maxCount: 1 },
		{ name: 'lessonsVideo', maxCount: 50 }
	]),
	async (req, res) => {
		try {
			const { title, description, price_cents, currency, category, teacher, lessons } = req.body;
			const files = req.files;
			const lessonsArr = typeof lessons === 'string' ? JSON.parse(lessons) : lessons;
			
			let finalTeacherId = req.user.role === 'admin' && teacher ? teacher : req.user.id;
			
			if (!category) return res.status(400).json({ error: 'Category is required' });
			if (!files?.preview) return res.status(400).json({ error: 'Preview image is required' });
			if (!files?.lessonsVideo) return res.status(400).json({ error: 'Lessons video is required' });
			
			// 1️⃣ Course yaratish
			const courseQ = await db.query(
				`INSERT INTO courses (title, description, teacher, category, price_cents, currency, published, preview_image)
         VALUES ($1,$2,$3,$4,$5,$6,false,$7) RETURNING *`,
				[
					title,
					description,
					finalTeacherId,
					category,
					price_cents || 0,
					currency || 'usd',
					files.preview ? `/uploads/courses/${files.preview[0].filename}` : null
				]
			);
			const course = courseQ.rows[0];
			
			// 2️⃣ Lessons yaratish
			let videoIndex = 0;
			for (let i = 0; i < lessonsArr.length; i++) {
				const les = lessonsArr[i];
				let videoPath = null;
				
				if (files.lessonsVideo && files.lessonsVideo[videoIndex]) {
					videoPath = `/uploads/lessons/${files.lessonsVideo[videoIndex].filename}`;
					videoIndex++;
				}
				
				await db.query(
					`INSERT INTO lessons (course_id, title, content, link, order_index, is_preview, is_published, video_url)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
					[
						course.id,
						les.title,
						les.content,
						les.link,
						les.order_index || i + 1,
						les.is_preview || false,
						les.is_published || false,
						videoPath
					]
				);
			}
			
			res.status(201).json({
				message: 'Course with lessons created successfully',
				courseId: course.id,
				lessons: lessonsArr.length,
			});
		} catch (err) {
			console.error('Course creation error:', err);
			res.status(500).json({ error: err.message });
		}
	}
);

router.post("/course", authenticate, authorizeRole('teacher', 'admin'), upload.fields([{ name: 'preview', maxCount: 1 }]), async (req, res) => {
	try {
		const { title, description, price_cents, currency, category, teacher } = req.body;
		const files = req.files;
		let finalTeacherId = req.user.role === 'admin' && teacher ? teacher : req.user.id;
		
		// if (!category) return res.status(400).json({ error: 'Category is required' });
		// if (!files?.preview) return res.status(400).json({ error: 'Preview image is required' });
		
		const courseQ = await db.query(
			`INSERT INTO courses (title, description, teacher, category, price_cents, currency, published, preview_image)
         VALUES ($1,$2,$3,$4,$5,$6,false,$7) RETURNING *`,
			[
				title,
				description,
				finalTeacherId,
				category,
				price_cents || 0,
				currency || 'usd',
				files.preview ? `/uploads/courses/${files.preview[0].filename}` : null
			]
		);
		
		res.status(201).json({
			message: "Course created successfully!",
			course: courseQ.rows[0]
		})
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
})

/**
 * PUT /courses/:id – kursni yangilash
 */
router.put('/:id', authenticate, authorizeRole('teacher', 'admin'), upload.single('preview'), async (req, res) => {
	try {
		const { title, description, category, price_cents, currency, published } = req.body;
		
		const previewImage = req.file
			? `/uploads/courses/${req.file.filename}`
			: null;
		
		const q = await db.query(
			`UPDATE courses
       SET title=$1, description=$2, category=$3, price_cents=$4, currency=$5,
           preview_image=COALESCE($6, preview_image), published=$7
       WHERE id=$8 RETURNING *`,
			[title, description, category, price_cents, currency, previewImage, published, req.params.id]
		);
		
		res.status(201).json(q.rows[0]);
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

router.put(
	'/full/:id',
	authenticate,
	authorizeRole('teacher', 'admin'),
	upload.fields([
		{ name: 'preview', maxCount: 1 },
		{ name: 'lessonsVideo', maxCount: 50 }
	]),
	async (req, res) => {
		try {
			const { id } = req.params;
			const { title, description, price_cents, currency, category, teacher, lessons, published } = req.body;
			const files = req.files;
			const lessonsArr = typeof lessons === 'string' ? JSON.parse(lessons) : lessons;
			
			// Course mavjudligini tekshirish
			const existingCourse = await db.query(
				'SELECT * FROM courses WHERE id = $1',
				[id]
			);
			
			if (existingCourse.rows.length === 0) {
				return res.status(404).json({ error: 'Course not found' });
			}
			
			const course = existingCourse.rows[0];
			
			// Teacher huquqini tekshirish (faqat admin boshqa teacherlarni update qilishi mumkin)
			let finalTeacherId = course.teacher;
			if (req.user.role === 'admin' && teacher) {
				finalTeacherId = teacher;
			} else if (req.user.role === 'teacher' && course.teacher !== req.user.id) {
				return res.status(403).json({ error: 'You can only update your own courses' });
			}
			
			if (!category) return res.status(400).json({ error: 'Category is required' });
			
			// 1️⃣ Course yangilash
			let previewImage = course.preview_image;
			if (files.preview && files.preview[0]) {
				previewImage = `/uploads/courses/${files.preview[0].filename}`;
				// Eski preview imagenio'chirish kerak bo'lsa
			}
			
			const courseUpdateQ = await db.query(
				`UPDATE courses
         SET title = $1, description = $2, teacher = $3, category = $4,
             price_cents = $5, currency = $6, published = $7, preview_image = $8
         WHERE id = $9 RETURNING *`,
				[
					title,
					description,
					finalTeacherId,
					category,
					price_cents || 0,
					currency || 'usd',
					published || false,
					previewImage,
					id
				]
			);
			const updatedCourse = courseUpdateQ.rows[0];
			
			// 2️⃣ Lessons yangilash
			// Avval mavjud lessonslarni olish
			const existingLessons = await db.query(
				'SELECT * FROM lessons WHERE course_id = $1 ORDER BY order_index',
				[id]
			);
			
			let videoIndex = 0;
			
			// Yangi lessons massivi bilan ishlash
			for (let i = 0; i < lessonsArr.length; i++) {
				const les = lessonsArr[i];
				
				// Video faylini aniqlash
				let videoPath = null;
				if (files?.lessonsVideo && files?.lessonsVideo[videoIndex]) {
					videoPath = `/uploads/lessons/${files.lessonsVideo[videoIndex].filename}`;
					videoIndex++;
				} else if (les.video_url) {
					// Agar yangi video upload qilinmasa, mavjud video urlni saqlab qolish
					videoPath = les.video_url;
				}
				
				if (les.id) {
					// Mavjud lessonni yangilash
					const existingLesson = existingLessons.rows.find(l => l.id === les.id);
					if (existingLesson) {
						await db.query(
							`UPDATE lessons
               SET title = $1, content = $2, link = $3, order_index = $4,
                   is_preview = $5, is_published = $6, video_url = $7
               WHERE id = $8`,
							[
								les.title,
								les.content,
								les.link,
								les.order_index || i + 1,
								les.is_preview || false,
								les.is_published || false,
								videoPath,
								les.id
							]
						);
					}
				} else {
					// Yangi lesson qo'shish
					await db.query(
						`INSERT INTO lessons (course_id, title, content, link, order_index, is_preview, is_published, video_url)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
						[
							id,
							les.title,
							les.content,
							les.link,
							les.order_index || i + 1,
							les.is_preview || false,
							les.is_published || false,
							videoPath
						]
					);
				}
			}
			
			// 3️⃣ O'chirilgan lessonslarni aniqlash va o'chirish
			const updatedLessonIds = lessonsArr.filter(les => les.id).map(les => les.id);
			const lessonsToDelete = existingLessons.rows.filter(les => !updatedLessonIds.includes(les.id));
			
			for (const lessonToDelete of lessonsToDelete) {
				await db.query('DELETE FROM lessons WHERE id = $1', [lessonToDelete.id]);
				// Lesson videolarini file systemdan o'chirish kerak bo'lsa
			}
			
			res.status(200).json({
				message: 'Course with lessons updated successfully',
				courseId: updatedCourse.id,
				updatedLessons: lessonsArr.length,
				deletedLessons: lessonsToDelete.length,
			});
			
		} catch (err) {
			console.error('Course update error:', err);
			res.status(500).json({ error: err.message });
		}
	}
);

/**
 * PUT /courses/:id/progress
 */
router.put('/:id/progress', authenticate, async (req, res) => {
	try {
		const { id } = req.params;
		const userId = req.user.id;
		const { lessonId, completed } = req.body;
		
		const enrollmentQ = await db.query(
			'SELECT * FROM enrollments WHERE user_id=$1 AND course_id=$2',
			[userId, id]
		);
		
		const enrollment = enrollmentQ.rows[0];
		if (!enrollment) return res.status(404).json({ error: 'Enrollment not found' });
		
		const currentProgress = enrollment.progress || {};
		currentProgress[lessonId] = completed;
		
		await db.query('UPDATE enrollments SET progress=$1 WHERE id=$2', [currentProgress, enrollment.id]);
		
		const lessonsQ = await db.query('SELECT id FROM lessons WHERE course_id=$1', [id]);
		const totalLessons = lessonsQ.rows.length;
		const completedLessons = Object.values(currentProgress).filter(v => v).length;
		const percent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
		
		res.status(200).json({ message: 'Progress updated', progress: currentProgress, completedLessons, totalLessons, percent });
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

router.patch('/:id', authenticate, authorizeRole('admin', 'teacher'), upload.none(), async (req, res) => {
	try {
		const id = req.params.id;
		
		// form-data ichidagi maydonlarni olib chiqamiz
		const updates = req.body;
		
		if (!updates || Object.keys(updates).length === 0) {
			return res.status(400).json({ error: "Hech qanday maydon yuborilmadi" });
		}
		
		// allowed fields xavfsizligi
		const allowed = ["title", "description", "price_cents", "published"];
		const filtered = Object.fromEntries(
			Object.entries(updates).filter(([key]) => allowed.includes(key))
		);
		
		// qiymatlarni to‘g‘ri tiplarga aylantirish
		if (filtered.price) filtered.price = parseFloat(filtered.price);
		if (filtered.published) filtered.published = filtered.published === "true";
		
		const keys = Object.keys(filtered);
		const values = Object.values(filtered);
		
		const setClause = keys.map((key, index) => `${key}=$${index + 1}`).join(", ");
		
		const query = `
      UPDATE courses
      SET ${setClause}
      WHERE id=$${keys.length + 1}
      RETURNING *;
    `;
		
		const q = await db.query(query, [...values, id]);
		
		if (q.rows.length === 0) {
			return res.status(404).json({ error: "Kurs topilmadi" });
		}
		
		res.json(q.rows[0]);
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: e.message });
	}
});


// router.patch('/:id', authenticate, authorizeRole('admin', 'teacher'), async (req, res) => {
// 	try {
// 		const updates = req.body;
// 		const id = req.params.id;
//
// 		// Agar hech narsa yuborilmagan bo‘lsa
// 		if (!updates || Object.keys(updates).length === 0) {
// 			return res.status(400).json({ error: "Empty datas" });
// 		}
//
// 		// Keylar va qiymatlar ajratamiz
// 		const keys = Object.keys(updates); // ["title", "price", "published"]
// 		const values = Object.values(updates); // ["React course", 49.99, true]
//
// 		// SQL SET qismi: "title=$1, price=$2, published=$3"
// 		const setClause = keys.map((key, index) => `${key}=$${index + 1}`).join(", ");
//
// 		// So‘rovni tuzamiz
// 		const query = `
//       UPDATE courses
//       SET ${setClause}
//       WHERE id=$${keys.length + 1}
//       RETURNING *;
//     `;
//
// 		// So‘rovni bajarish
// 		const q = await db.query(query, [...values, id]);
//
// 		if (q.rows.length === 0) {
// 			return res.status(404).json({ error: "Course not found" });
// 		}
//
// 		res.json(q.rows[0]);
// 	} catch (e) {
// 		console.error(e);
// 		res.status(500).json({ error: e.message });
// 	}
// });


/**
 * PATCH /courses/:id/publish – kursni publish/unpublish qilish
 */
router.patch('/:id/publish', authenticate, authorizeRole('admin'), async (req, res) => {
	try {
		const { published } = req.body;
		const q = await db.query(`UPDATE courses SET published=$1 WHERE id=$2 RETURNING *`, [published, req.params.id]);
		res.json(q.rows[0]);
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

/**
 * DELETE /courses/:id – kurs va uning lesson videolarini o‘chirish
 */
router.delete('/:id', authenticate, async (req, res) => {
	try {
		const { id } = req.params;
		
		const courseQ = await db.query(
			`SELECT c.*, u.role as teacher_role FROM courses c JOIN users u ON c.teacher_id = u.id WHERE c.id = $1`,
			[id]
		);
		
		const course = courseQ.rows[0];
		if (!course) return res.status(404).json({ error: 'Course not found' });
		
		if (req.user.role !== 'admin' && req.user.id !== course.teacher_id)
			return res.status(403).json({ error: 'Forbidden' });
		
		const filesToDelete = [];
		
		if (course.preview_image) filesToDelete.push(course.preview_image);
		
		const lessonsVideosQ = await db.query(
			'SELECT video_url FROM lessons WHERE course_id = $1 AND video_url IS NOT NULL',
			[id]
		);
		
		lessonsVideosQ.rows.forEach(lesson => {
			if (lesson.video_url) filesToDelete.push(lesson.video_url);
		});
		
		await db.query('DELETE FROM courses WHERE id = $1', [id]);
		await deleteFiles(filesToDelete);
		
		res.status(204).json({ ok: true });
	} catch (e) {
		console.error('Course deletion error:', e);
		res.status(500).json({ error: e.message });
	}
});

module.exports = router;
