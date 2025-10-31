import { configureStore } from '@reduxjs/toolkit'
import courseSlice from "@/features/course/courseSlice.js";
import categorySlice from "@/features/category/categorySlice.js";
import adminSlice from "@/features/admin/adminSlice.js";
import lessonSlice from "@/features/course/lessonSlice.js";

const combinedReducer = {
	course: courseSlice,
	lesson: lessonSlice,
	category: categorySlice,
	admin: adminSlice
}

export default configureStore({
	reducer: combinedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
})