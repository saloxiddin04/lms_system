import { configureStore } from '@reduxjs/toolkit'
import courseSlice from "@/features/course/courseSlice.js";
import categorySlice from "@/features/category/categorySlice.js";
import adminSlice from "@/features/admin/adminSlice.js";

const combinedReducer = {
	course: courseSlice,
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