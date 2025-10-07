import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import instance from "@/utils/axios.js";

export const getCourses = createAsyncThunk(
	"course/getCourses",
	async (_, thunkAPI) => {
		try {
			const response = await instance.get('/courses/')
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e.response?.data || e.message);
		}
	}
);

export const getCourseById = createAsyncThunk(
	"course/getCourseById",
	async ({id}, thunkAPI) => {
		try {
			const response = await instance.get(`/courses/${id}`);
			return response.data;
		} catch (e) {
			return thunkAPI.rejectWithValue(e.response.data || e.message);
		}
	}
);

export const createCourse = createAsyncThunk(
	"course/createCourse",
	async (formData, thunkAPI) => {
		try {
			const response = await instance.post("/courses/", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			thunkAPI.dispatch(getCourses())
			return response.data;
		} catch (e) {
			return thunkAPI.rejectWithValue(e.response?.data || e.message);
		}
	}
);

export const updateCourse = createAsyncThunk(
	"course/updateCourse",
	async ({ id, formData }, thunkAPI) => {
		try {
			const response = await instance.put(`/courses/${id}`, formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			thunkAPI.dispatch(getCourses())
			return response.data;
		} catch (e) {
			return thunkAPI.rejectWithValue(e.response?.data || e.message);
		}
	}
);

export const deleteCourse = createAsyncThunk(
	"course/deleteCourse",
	async ({id}, thunkAPI) => {
		try {
			await instance.delete(`/courses/${id}`);
			thunkAPI.dispatch(getCourses())
			return id;
		} catch (e) {
			return thunkAPI.rejectWithValue(e.response?.data || e.message);
		}
	}
);

export const togglePublishCourse = createAsyncThunk(
	"course/togglePublish",
	async ({ id, published }, thunkAPI) => {
		try {
			const response = await instance.patch(`/courses/${id}/publish`, { published });
			thunkAPI.dispatch(getCourses())
			return response.data;
		} catch (e) {
			return thunkAPI.rejectWithValue(e.response?.data || e.message);
		}
	}
);

const courseSlice = createSlice({
	name: "course",
	initialState: {
		loading: false,
		courses: null,
		course: null
	},
	extraReducers: builder => {
		// getCourses
		builder
			.addCase(getCourses.pending, (state) => {
				state.loading = true
			})
			.addCase(getCourses.fulfilled, (state, {payload}) => {
				state.courses = payload
				state.loading = false
			})
			.addCase(getCourses.rejected, (state) => {
				state.loading = false
			})
		
		// getCourseById
		builder
			.addCase(getCourseById.pending, (state) => {
				state.loading = true
			})
			.addCase(getCourseById.fulfilled, (state, {payload}) => {
				state.course = payload
				state.loading = false
			})
			.addCase(getCourseById.rejected, (state) => {
				state.loading = false
			})
		
		// createCourse
		builder
			.addCase(createCourse.pending, (state) => {
				state.loading = true
			})
			.addCase(createCourse.fulfilled, (state) => {
				state.loading = false
			})
			.addCase(createCourse.rejected, (state) => {
				state.loading = false
			})
		
		// updateCourse
		builder
			.addCase(updateCourse.pending, (state) => {
				state.loading = true
			})
			.addCase(updateCourse.fulfilled, (state) => {
				state.loading = false
			})
			.addCase(updateCourse.rejected, (state) => {
				state.loading = false
			})
		
		// deleteCourse
		builder
			.addCase(deleteCourse.pending, (state) => {
				state.loading = true
			})
			.addCase(deleteCourse.fulfilled, (state) => {
				state.loading = false
			})
			.addCase(deleteCourse.rejected, (state) => {
				state.loading = false
			})
		
		// togglePublishCourse
		builder
			.addCase(togglePublishCourse.pending, (state) => {
				state.loading = true
			})
			.addCase(togglePublishCourse.fulfilled, (state) => {
				state.loading = false
			})
			.addCase(togglePublishCourse.rejected, (state) => {
				state.loading = false
			})
	}
})

export default courseSlice.reducer