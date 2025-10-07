import React, {useEffect, useState} from 'react';
import {z} from "zod";
import {useDispatch} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Button} from "@/components/ui/button.jsx";
import {createCategory, getCategory, updateCategory} from "@/features/category/categorySlice.js";
import toast from "react-hot-toast";

const categorySchema = z.object({
	name: z.string().min(1, "Name is required"),
	slug: z.string()
		.min(1, "Slug is required")
		.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
			message: "Slug can only contain lowercase letters, numbers, and hyphens. No spaces, commas, or special characters allowed."
		})
		.refine((slug) => !slug.startsWith('-') && !slug.endsWith('-'), {
			message: "Slug cannot start or end with a hyphen"
		})
		.refine((slug) => !slug.includes('--'), {
			message: "Slug cannot contain consecutive hyphens"
		})
});

const CreateCategory = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const {id} = useParams()
	
	const [isLoading, setIsLoading] = useState(false);
	const [serverError, setServerError] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: {errors},
		reset
	} = useForm({
		resolver: zodResolver(categorySchema),
		defaultValues: {
			name: "",
			slug: ""
		}
	});
	
	const nameValue = watch("name");
	
	useEffect(() => {
		if (nameValue) {
			const generatedSlug = nameValue
				.toLowerCase()
				.trim()
				.replace(/[^a-z0-9\s]/g, '')
				.replace(/\s+/g, '-')
				.replace(/-+/g, '-')
				.replace(/^-|-$/g, '');
			
			setValue("slug", generatedSlug);
		}
	}, [nameValue, setValue]);
	
	useEffect(() => {
		if (id !== "id") {
			dispatch(getCategory({id})).then(({payload}) => {
				reset({
					name: payload?.name,
					slug: payload?.slug
				})
			})
		}
	}, [dispatch, id])
	
	const onSubmit = (data) => {
		setIsLoading(true);
		setServerError("");
		setSuccessMessage("");
		
		try {
			if (id === "id") {
				dispatch(createCategory({...data}))
				toast.success("Created successfully")
			} else {
				dispatch(updateCategory({id, ...data}))
				toast.success("Updated successfully")
			}
			navigate("/admin/category")
			reset()
		} catch (error) {
			setServerError(error.response?.data?.error || error.message || "Failed to create category");
		} finally {
			setIsLoading(false);
		}
	}
	
	return (
		<div className="container mx-auto py-8 px-4 max-w-4xl">
			<div className="mb-6">
				<h1 className="text-3xl font-bold text-gray-900">
					{id === "id" ? "Create New Category" : "Update Category"}
				</h1>
				<p className="text-gray-600 mt-2">
					{id === "id" ? "Create a complete category" : "Update a complete category"}
				</p>
			</div>
			
			{/* Server Messages */}
			{serverError && (
				<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
					<strong>Error: </strong> {serverError}
				</div>
			)}
			
			{successMessage && (
				<div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6">
					<strong>Success: </strong> {successMessage}
				</div>
			)}
			
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				{/* Course Basic Information */}
				<Card>
					<CardHeader>
						<CardTitle>Category Information</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{/* category name */}
						<div className="flex flex-col gap-1">
							<Label htmlFor="course-title">Category name *</Label>
							<Input
								id="category-name"
								{...register("name")}
								placeholder="Enter category name"
								className={errors.name ? "border-red-500" : ""}
							/>
							{errors.name && (
								<p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
							)}
						</div>
						
						{/* category name */}
						<div className="flex flex-col gap-1">
							<Label htmlFor="course-title">Category slug *</Label>
							<Input
								id="category-slug"
								{...register("slug")}
								placeholder="Enter category slug"
								readOnly
								className={errors.slug ? "border-red-500" : ""}
							/>
							{errors.slug && (
								<p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>
							)}
						</div>
					</CardContent>
				</Card>
				
				<div className="flex justify-end space-x-4 pt-6 border-t">
					<Button
						type="button"
						variant="outline"
						className={"bg-red-500 text-white"}
						onClick={() => navigate('/admin/category')}
						disabled={isLoading}
					>
						Cancel
					</Button>
					<Button
						type="button"
						variant="outline"
						onClick={() => reset()}
						disabled={isLoading}
					>
						Reset Form
					</Button>
					<Button
						type="submit"
						disabled={isLoading}
						className="min-w-32"
					>
						{isLoading ? (
							<>
								<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
								{id === "id" ? "Creating..." : "Updating..."}
							</>
						) : (
							id === "id" ? "Create Category" : "Update Category"
						)}
					</Button>
				</div>
			</form>
		</div>
	);
};

export default CreateCategory;