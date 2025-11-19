import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import instance from "@/utils/axios.js";
import {getCourseById} from "@/features/course/courseSlice.js";

export const getLessonsByCourseId = createAsyncThunk(
	"lesson/getLessonsByCourseId",
	async ({courseId}, thunkAPI) => {
		try {
			const response = await instance.get(`/lessons/${courseId}/lessons`)
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e?.response?.data || e.message)
		}
	}
)

export const getLessonById = createAsyncThunk(
	"lesson/getLessonById",
	async ({id}, thunkAPI) => {
		try {
			const response = await instance.get(`/lessons/${id}`)
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e.response?.data || e.message);
		}
	}
)

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

export const updateLesson = createAsyncThunk(
	"lesson/updateLesson",
	async ({id, data}, thunkAPI) => {
		try {
			const response = await instance.patch(`/lessons/${id}`, data, {
				headers: {"Content-type": "multipart/form-data"}
			})
			thunkAPI.dispatch(getLessonById({id}))
			return response.data
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

export const togglePublishLesson = createAsyncThunk(
	"lesson/togglePublishLesson",
	async ({ id, is_published }, thunkAPI) => {
		try {
			const response = await instance.patch(`/lessons/${id}/publish`, { is_published });
			thunkAPI.dispatch(getLessonById({id}))
			return response.data;
		} catch (e) {
			return thunkAPI.rejectWithValue(e.response?.data || e.message);
		}
	}
);

export const progressLesson = createAsyncThunk(
	"lesson/progressLesson",
	async ({courseId, lessonId}, thunkAPI) => {
		try {
			const response = await instance.put(`/courses/${courseId}/progress`, {lessonId})
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e.response?.data || e.message);
		}
	}
)

export const deleteLesson = createAsyncThunk(
	"lesson/deleteLesson",
	async ({lessonId}, thunkAPI) => {
		try {
			const response = await instance.delete(`/lessons/${lessonId}`)
			return response.data
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
		// getLessonByCourseId
		builder
			.addCase(getLessonsByCourseId.pending, (state) => {
				state.loading = true
			})
			.addCase(getLessonsByCourseId.fulfilled, (state, {payload}) => {
				state.lessons = payload
				state.loading = false
			})
			.addCase(getLessonsByCourseId.rejected, (state) => {
				state.loading = false
			})
		
		// getLessonById
		builder
			.addCase(getLessonById.pending, (state) => {
				state.loading = true
			})
			.addCase(getLessonById.fulfilled, (state, {payload}) => {
				state.lesson = payload
				state.loading = false
			})
			.addCase(getLessonById.rejected, (state) => {
				state.loading = false
			})
		
		// createLesson
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
		
		// updateLesson
		builder
			.addCase(updateLesson.pending, (state) => {
				state.loading = true
			})
			.addCase(updateLesson.fulfilled, (state) => {
				state.loading = false
			})
			.addCase(updateLesson.rejected, (state) => {
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
		
		// togglePublishLesson
		builder
			.addCase(togglePublishLesson.pending, (state) => {
				state.loading = true
			})
			.addCase(togglePublishLesson.fulfilled, (state) => {
				state.loading = false
			})
			.addCase(togglePublishLesson.rejected, (state) => {
				state.loading = false
			})
		
		// progressLesson
		builder
			.addCase(progressLesson.pending, (state) => {
				state.loading = true
			})
			.addCase(progressLesson.fulfilled, (state) => {
				state.loading = false
			})
			.addCase(progressLesson.rejected, (state) => {
				state.loading = false
			})
		
		// deleteLesson
		builder
			.addCase(deleteLesson.pending, (state) => {
				state.loading = true
			})
			.addCase(deleteLesson.fulfilled, (state) => {
				state.loading = false
			})
			.addCase(deleteLesson.rejected, (state) => {
				state.loading = false
			})
	}
})

export default lessonSlice.reducer
