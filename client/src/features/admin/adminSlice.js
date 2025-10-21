import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import instance from "@/utils/axios.js";

export const getUsers = createAsyncThunk(
	"admin/getUsers",
	async (_, thunkAPI) => {
		try {
			const response = await instance.get('/admin/users')
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e)
		}
	}
)

export const getUser = createAsyncThunk(
	"admin/getUser",
	async ({id}, thunkAPI) => {
		try {
			const response = await instance.get(`/admin/users/${id}`)
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e)
		}
	}
)

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

export const updateUser = createAsyncThunk(
	"admin/updateUser",
	async ({id, data}, thunkAPI) => {
		try {
			const response = await instance.patch(`/admin/users/${id}`, data)
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e)
		}
	}
)

export const deleteUser = createAsyncThunk(
	"admin/deleteUser",
	async ({id}, thunkAPI) => {
		try {
			const response = await instance.delete(`/admin/users/${id}`)
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
		users: null,
		userDetail: null,
		loading: false
	},
	extraReducers: (builder) => {
		// getUsers
		builder
			.addCase(getUsers.pending, (state) => {
				state.loading = true
			})
			.addCase(getUsers.fulfilled, (state, {payload}) => {
				state.users = payload
				state.loading = false
			})
			.addCase(getUsers.rejected, (state) => {
				state.loading = false
			})
		
		// getUser
		builder
			.addCase(getUser.pending, (state) => {
				state.loading = true
			})
			.addCase(getUser.fulfilled, (state, {payload}) => {
				state.userDetail = payload
				state.loading = false
			})
			.addCase(getUser.rejected, (state) => {
				state.loading = false
			})
		
		// getTeachers
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
		
		// updateUser
		builder
			.addCase(updateUser.pending, (state) => {
				state.loading = true
			})
			.addCase(updateUser.fulfilled, (state) => {
				state.loading = false
			})
			.addCase(updateUser.rejected, (state) => {
				state.loading = false
			})
		
		// deleteUser
		builder
			.addCase(deleteUser.pending, (state) => {
				state.loading = true
			})
			.addCase(deleteUser.fulfilled, (state) => {
				state.loading = false
			})
			.addCase(deleteUser.rejected, (state) => {
				state.loading = false
			})
	}
})

export default adminSlice.reducer