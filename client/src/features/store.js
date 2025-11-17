import { configureStore } from '@reduxjs/toolkit'
import courseSlice from "@/features/course/courseSlice.js";
import categorySlice from "@/features/category/categorySlice.js";
import adminSlice from "@/features/admin/adminSlice.js";
import lessonSlice from "@/features/course/lessonSlice.js";
import enrollSlice from "@/features/enroll/enrollSlice.js";
import dashboardSlice from "@/features/dashboard/dashboardSlice.js";

const combinedReducer = {
	dashboard: dashboardSlice,
	course: courseSlice,
	lesson: lessonSlice,
	category: categorySlice,
	enroll: enrollSlice,
	admin: adminSlice
}

export default configureStore({
	reducer: combinedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
})