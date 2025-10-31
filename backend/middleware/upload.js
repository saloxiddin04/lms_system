// import multer from 'multer';
// import path from 'path';
//
// // Fayllarni saqlash joyi va nomi
// const storage = multer.diskStorage({
// 	destination: (req, file, cb) => {
// 		if (file.fieldname === "preview") {
// 			cb(null, 'uploads/courses'); // uploads/courses papkaga saqlanadi
// 		} else if (file.fieldname === "video_url") {
// 			cb(null, 'uploads/lessons'); // uploads/lessons papkaga saqlanadi
// 		} else {
// 			cb(new Error('Invalid field name'), false);
// 		}
// 	},
// 	filename: (req, file, cb) => {
// 		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
// 		cb(null, uniqueSuffix + path.extname(file.originalname));
// 	}
// });
//
// // Faqat rasm va video fayllariga ruxsat
// const fileFilter = (req, file, cb) => {
// 	if (file.fieldname === "preview" && file.mimetype.startsWith('image/')) {
// 		cb(null, true);
// 	} else if (file.fieldname === "video_url" && file.mimetype.startsWith('video/')) {
// 		cb(null, true);
// 	} else {
// 		cb(new Error('Invalid file type'), false);
// 	}
// };
//
// export const upload = multer({ storage, fileFilter });

// middleware/upload.js
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fayllarni saqlash joyi va nomi
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		if (file.fieldname === "preview_image") {
			cb(null, 'uploads/courses'); // Course preview images
		} else if (file.fieldname === "lessonsVideo") { // 🔥 To'g'rilandi
			cb(null, 'uploads/lessons'); // Lesson videos
		} else {
			cb(new Error(`Invalid field name: ${file.fieldname}`), false);
		}
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
		cb(null, uniqueSuffix + path.extname(file.originalname));
	}
});

// Faqat rasm va video fayllariga ruxsat
const fileFilter = (req, file, cb) => {
	if (file.fieldname === "preview_image" && file.mimetype.startsWith('image/')) {
		cb(null, true);
	} else if (file.fieldname === "lessonsVideo" && file.mimetype.startsWith('video/')) { // 🔥 To'g'rilandi
		cb(null, true);
	} else {
		cb(new Error(`Invalid file type for field ${file.fieldname}. Expected: ${file.fieldname === 'preview_image' ? 'image' : 'video'}, got: ${file.mimetype}`), false);
	}
};

export async function deleteFiles(filePaths) {
	const deletePromises = filePaths.map(async (filePath) => {
		if (!filePath) return;
		
		try {
			// URL dan haqiqiy fayl yo'lini olish
			// Diqqat: filePath "/uploads/courses/filename.jpg" formatida keladi
			// Bizga "uploads/courses/filename.jpg" kerak (boshidagi / ni olib tashlash)
			const relativePath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
			const fullPath = path.join(process.cwd(), 'uploads', relativePath.split('/').slice(1).join('/'));
			
			// Fayl mavjudligini tekshirish
			try {
				await fs.access(fullPath);
				await fs.unlink(fullPath);
				console.log('File deleted successfully:', fullPath);
			} catch (accessError) {
				if (accessError.code === 'ENOENT') {
					console.log('File not found, already deleted:', fullPath);
				} else {
					throw accessError;
				}
			}
		} catch (error) {
			console.error('Error deleting file:', filePath, error.message);
		}
	});
	
	await Promise.allSettled(deletePromises);
}

export const upload = multer({
	storage,
	fileFilter,
	limits: {
		fileSize: 100 * 1024 * 1024 // 100MB limit
	}
});
