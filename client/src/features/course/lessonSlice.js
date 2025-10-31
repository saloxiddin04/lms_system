import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import instance from "@/utils/axios.js";
import {getCourseById} from "@/features/course/courseSlice.js";

export const createLesson = createAsyncThunk(
	"lesson/createLesson",
	async ({formData, courseId}, thunkAPI) => {
		try {
			const response = await instance.post(`/lessons/${courseId}/lesson`, formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			thunkAPI.dispatch(getCourseById({id: courseId}))
			return response.data;
		} catch (e) {
			return thunkAPI.rejectWithValue(e.response?.data || e.message);
		}
	}
)

export const reorderLesson = createAsyncThunk(
	"lesson/reorderLesson",
	async ({formData, courseId}, thunkAPI) => {
		try {
			const response = await instance.put(`/lessons/${courseId}/lesson/reorder`, formData)
			thunkAPI.dispatch(getCourseById({id: courseId}))
			return response.data;
		} catch (e) {
			return thunkAPI.rejectWithValue(e.response?.data || e.message);
		}
	}
)

const lessonSlice = createSlice({
	name: "lesson",
	initialState: {
		loading: false,
		lessons: null,
		lesson: null
	},
	extraReducers: (builder) => {
		builder
			.addCase(createLesson.pending, (state) => {
				state.loading = true
			})
			.addCase(createLesson.fulfilled, (state) => {
				state.loading = false
			})
			.addCase(createLesson.rejected, (state) => {
				state.loading = false
			})
		
		// reorderLesson
		builder
			.addCase(reorderLesson.pending, (state) => {
				state.loading = true
			})
			.addCase(reorderLesson.fulfilled, (state) => {
				state.loading = false
			})
			.addCase(reorderLesson.rejected, (state) => {
				state.loading = false
			})
	}
})

export default lessonSlice.reducer
