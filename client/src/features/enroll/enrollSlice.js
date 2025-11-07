import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import instance from "@/utils/axios.js";

export const enrollCourse = createAsyncThunk(
	"enroll/enrollCourse",
	async ({id}, thunkAPI) => {
		try {
			const {data} = await instance.post(`/payments/${id}/enroll`)
			return data
		} catch (e) {
			return thunkAPI.rejectWithValue(e?.response?.data || e.message)
		}
	}
)

export const confirmPayment = createAsyncThunk(
	'enroll/confirmPayment',
	async ({sessionId},  thunkAPI) => {
		try {
			const { data } = await instance.get(`/payments/confirm?session_id=${sessionId}`)
			return data
		} catch (e) {
			return thunkAPI.rejectWithValue(e?.response?.data || e.message)
		}
	}
)

const enrollSlice = createSlice({
	name: 'enroll',
	initialState: {
		loading: false,
		success: null,
		url: null,
		message: null,
		error: null,
	},
	reducers: {
		resetEnroll: (state) => {
			state.loading = false
			state.success = null
			state.url = null
			state.message = null
			state.error = null
		},
	},
	extraReducers: (builder) => {
		builder
			// Enroll
			.addCase(enrollCourse.pending, (state) => {
				state.loading = true
				state.error = null
			})
			.addCase(enrollCourse.fulfilled, (state, action) => {
				state.loading = false
				if (action.payload.url) {
					state.url = action.payload?.url // Stripe checkout URL
				} else {
					state.message = action.payload?.message // Free enroll
				}
			})
			.addCase(enrollCourse.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload?.error
			})
			
			// Confirm
			.addCase(confirmPayment.pending, (state) => {
				state.loading = true
			})
			.addCase(confirmPayment.fulfilled, (state, action) => {
				state.loading = false
				state.success = true
				state.message = action.payload.message
			})
			.addCase(confirmPayment.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload?.error
			})
	},
})

export const { resetEnroll } = enrollSlice.actions
export default enrollSlice.reducer