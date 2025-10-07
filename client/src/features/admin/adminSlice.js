import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import instance from "@/utils/axios.js";

export const getTeachers = createAsyncThunk(
	"admin/getTeachers",
	async (_, thunkAPI) => {
		try {
			const response = await instance.get('/admin/teachers/')
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e)
		}
	}
)

const adminSlice = createSlice({
	name: "admin",
	initialState: {
		teachers: null,
		loading: false
	},
	extraReducers: (builder) => {
		builder
			.addCase(getTeachers.pending, (state) => {
				state.loading = true
			})
			.addCase(getTeachers.fulfilled, (state, {payload}) => {
				state.teachers = payload
				state.loading = false
			})
			.addCase(getTeachers.rejected, (state) => {
				state.loading = false
			})
	}
})

export default adminSlice.reducer