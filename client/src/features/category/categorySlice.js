import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import instance from "@/utils/axios.js";

export const getCategories = createAsyncThunk(
	"category/getCategories",
	async (_, thunkAPI) => {
		try {
			const response = await instance.get('/categories')
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e.message)
		}
	}
)

export const searchCategory = createAsyncThunk(
	"category/searchCategory",
	async (searchTerm, thunkAPI) => {
		try {
			const response = await instance.get('/categories/search', {params: {q: searchTerm}})
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e.message)
		}
	}
)

export const getCategory = createAsyncThunk(
	"category/getCategory",
	async ({id}, thunkAPI) => {
		try {
			const response = await instance.get(`/categories/${id}`)
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e.message)
		}
	}
)

export const createCategory = createAsyncThunk(
	"category/createCategory",
	async ({name, slug}, thunkAPI) => {
		try {
			const response = await instance.post(`/categories/`, {name, slug})
			thunkAPI.dispatch(getCategories())
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e.message)
		}
	}
)

export const updateCategory = createAsyncThunk(
	"category/updateCategory",
	async ({name, slug, id}, thunkAPI) => {
		try {
			const response = await instance.put(`/categories/${id}`, {name, slug})
			thunkAPI.dispatch(getCategories())
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e.message)
		}
	}
)

export const deleteCategory = createAsyncThunk(
	"category/deleteCategory",
	async ({id}, thunkAPI) => {
		try {
			const response = await instance.delete(`/categories/${id}`)
			thunkAPI.dispatch(getCategories())
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e.message)
		}
	}
)

const categorySlice = createSlice({
	name: "category",
	initialState: {
		loading: false,
		searchLoading: false,
		categories: null,
		category: null
	},
	extraReducers: (builder) => {
		builder
			.addCase(getCategories.pending, (state) => {
				state.loading = true
			})
			.addCase(getCategories.fulfilled, (state, {payload}) => {
				state.categories = payload
				state.loading = false
			})
			.addCase(getCategories.rejected, (state) => {
				state.loading = false
			})
		
		// searchCategory
		builder
			.addCase(searchCategory.pending, (state) => {
				state.searchLoading = true
			})
			.addCase(searchCategory.fulfilled, (state, {payload}) => {
				state.categories = payload?.categories
				state.searchLoading = false
			})
			.addCase(searchCategory.rejected, (state) => {
				state.searchLoading = false
			})
		
		// getCategory
		builder
			.addCase(getCategory.pending, (state) => {
				state.loading = true
			})
			.addCase(getCategory.fulfilled, (state, {payload}) => {
				state.category = payload
				state.loading = false
			})
			.addCase(getCategory.rejected, (state) => {
				state.loading = false
			})
		
		// createCategory
		builder
			.addCase(createCategory.pending, (state) => {
				state.loading = true
			})
			.addCase(createCategory.fulfilled, (state, {payload}) => {
				state.loading = false
			})
			.addCase(createCategory.rejected, (state) => {
				state.loading = false
			})
		
		// updateCategory
		builder
			.addCase(updateCategory.pending, (state) => {
				state.loading = true
			})
			.addCase(updateCategory.fulfilled, (state, {payload}) => {
				state.loading = false
			})
			.addCase(updateCategory.rejected, (state) => {
				state.loading = false
			})
		
		// deleteCategory
		builder
			.addCase(deleteCategory.pending, (state) => {
				state.loading = true
			})
			.addCase(deleteCategory.fulfilled, (state, {payload}) => {
				state.loading = false
			})
			.addCase(deleteCategory.rejected, (state) => {
				state.loading = false
			})
	}
})

export default categorySlice.reducer