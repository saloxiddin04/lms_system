import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import instance from "@/utils/axios.js";

export const getTeacherDashboard = createAsyncThunk(
	"dashboard/getTeacherDashboard",
	async (_, thunkAPI) => {
		try {
			const response = await instance.get("/dashboard/teacher")
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e?.response?.data || e.message)
		}
	}
)

export const getMyCoursesForStudent = createAsyncThunk(
	"dashboard/getMyCoursesForStudent",
	async (_, {thunkAPI}) => {
		try {
			const response = await instance.get("/dashboard/my-courses")
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e?.response?.data || e.message)
		}
	}
)

const dashboardSlice = createSlice({
	name: "dashboard",
	initialState: {
		loading: false,
		teacherDashboard: null,
		myCourses: null
	},
	extraReducers: builder => {
		builder
			.addCase(getTeacherDashboard.pending, (state) => {
				state.loading = true
			})
			.addCase(getTeacherDashboard.fulfilled, (state, {payload}) => {
				state.teacherDashboard = payload
				state.loading = false
			})
			.addCase(getTeacherDashboard.rejected, (state) => {
				state.loading = false
			})
		
		// getMyCoursesForStudent
		builder
			.addCase(getMyCoursesForStudent.pending, (state) => {
				state.loading = true
			})
			.addCase(getMyCoursesForStudent.fulfilled, (state, {payload}) => {
				state.myCourses = payload
				state.loading = false
			})
			.addCase(getMyCoursesForStudent.rejected, (state) => {
				state.loading = false
			})
	}
})

export default dashboardSlice.reducer