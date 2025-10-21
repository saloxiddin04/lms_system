import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import instance from "@/utils/axios.js";
import { Switch } from "@/components/ui/switch.jsx";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select.jsx";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "@/features/category/categorySlice.js";
import { getTeachers } from "@/features/admin/adminSlice.js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {getUserData} from "@/auth/jwtService.js";
import {getCourseById} from "@/features/course/courseSlice.js";

// Validation schema - sizning database schema ga mos
const lessonSchema = z.object({
	id: z.number().optional(), // Mavjud darslar uchun
	title: z.string().min(1, "Lesson title is required"),
	content: z.string().optional(),
	video_url: z.string().optional(), // Mavjud video URL
	video_file: z.any().optional(), // Yangi video fayl
	link: z.string().url("Must be a valid URL").optional().or(z.literal("")),
	order_index: z.number(),
	is_preview: z.boolean().default(false),
	is_published: z.boolean().default(false),
});

const courseSchema = z.object({
	title: z.string().min(1, "Course title is required"),
	description: z.string().min(1, "Description is required"),
	category_id: z.string().min(1, "Category is required"),
	teacher_id: z.string().min(1, "Teacher is required"),
	price_cents: z.number().min(0, "Price must be positive"),
	currency: z.string().min(1, "Currency is required"),
	published: z.boolean().default(false),
	preview_image: z.any().optional(), // Preview image fayli
	lessons: z.array(lessonSchema).min(1, "At least one lesson is required"),
});

// Lesson Section Component
const LessonSection = ({
	                       control,
	                       register,
	                       lessonIndex,
	                       removeLesson,
	                       errors,
	                       isExistingLesson
                       }) => (
	<Card className="border border-gray-200 p-4 bg-white mb-4">
		<CardHeader className="flex flex-row justify-between items-center p-0 pb-4">
			<CardTitle className="text-lg">
				Lesson {lessonIndex + 1} {isExistingLesson && "(Existing)"}
			</CardTitle>
			<Button
				type="button"
				variant="destructive"
				size="sm"
				onClick={() => removeLesson(lessonIndex)}
			>
				Remove
			</Button>
		</CardHeader>
		
		<CardContent className="p-0 space-y-4">
			{/* Hidden ID field for existing lessons */}
			{isExistingLesson && (
				<Input
					type="hidden"
					{...register(`lessons.${lessonIndex}.id`)}
				/>
			)}
			
			{/* Title */}
			<div className="flex flex-col gap-1">
				<Label>Lesson Title *</Label>
				<Input
					{...register(`lessons.${lessonIndex}.title`)}
					placeholder="Enter lesson title"
					className={errors?.lessons?.[lessonIndex]?.title ? "border-red-500" : ""}
				/>
				{errors?.lessons?.[lessonIndex]?.title && (
					<p className="text-red-500 text-sm">
						{errors.lessons[lessonIndex].title.message}
					</p>
				)}
			</div>
			
			{/* Content */}
			<div className="flex flex-col gap-1">
				<Label>Content</Label>
				<Textarea
					{...register(`lessons.${lessonIndex}.content`)}
					placeholder="Lesson content"
					rows={3}
				/>
			</div>
			
			{/* Video Section */}
			<div className="space-y-2">
				<Label>Video</Label>
				
				{/* Existing Video */}
				{isExistingLesson && (
					<Controller
						control={control}
						name={`lessons.${lessonIndex}.video_url`}
						render={({ field: { value } }) => (
							value && (
								<div className="bg-gray-50 p-3 rounded-md">
									<p className="text-sm text-gray-600 mb-2">Current Video:</p>
									<a
										href={value}
										target="_blank"
										rel="noopener noreferrer"
										className="text-blue-600 hover:underline text-sm"
									>
										{value}
									</a>
								</div>
							)
						)}
					/>
				)}
				
				{/* New Video Upload */}
				<Controller
					control={control}
					name={`lessons.${lessonIndex}.video_file`}
					render={({ field: { onChange, value }, fieldState: { error } }) => (
						<div>
							<Label className="text-sm text-gray-600">
								{isExistingLesson ? "Replace Video (Optional)" : "Upload Video *"}
							</Label>
							<Input
								type="file"
								accept="video/*"
								onChange={(e) => onChange(e.target.files[0])}
								className={error ? "border-red-500" : ""}
							/>
							{value && (
								<p className="text-sm text-green-600 mt-1">
									Selected: {value.name}
								</p>
							)}
							{error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
						</div>
					)}
				/>
			</div>
			
			{/* Link */}
			<div className="flex flex-col gap-1">
				<Label>External Link</Label>
				<Input
					{...register(`lessons.${lessonIndex}.link`)}
					placeholder="https://example.com"
				/>
			</div>
			
			{/* Order Index */}
			<div className="flex flex-col gap-1">
				<Label>Order Index</Label>
				<Input
					type="number"
					{...register(`lessons.${lessonIndex}.order_index`, { valueAsNumber: true })}
					placeholder="1"
				/>
			</div>
			
			{/* Switches */}
			<div className="flex flex-col gap-4">
				<Controller
					control={control}
					name={`lessons.${lessonIndex}.is_preview`}
					render={({ field }) => (
						<div className="flex items-center gap-2">
							<Switch
								checked={field.value}
								onCheckedChange={field.onChange}
							/>
							<Label>Preview Lesson (Free access)</Label>
						</div>
					)}
				/>
				
				<Controller
					control={control}
					name={`lessons.${lessonIndex}.is_published`}
					render={({ field }) => (
						<div className="flex items-center gap-2">
							<Switch
								checked={field.value}
								onCheckedChange={field.onChange}
							/>
							<Label>Published</Label>
						</div>
					)}
				/>
			</div>
		</CardContent>
	</Card>
);

export default function UpdateCourse() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { id } = useParams();
	const { categories } = useSelector(state => state.category);
	const { teachers } = useSelector(state => state.admin);
	const {course} = useSelector(state => state.course)
	
	const [isLoading, setIsLoading] = useState(false);
	const [serverError, setServerError] = useState("");
	const [activeTab, setActiveTab] = useState("course");
	
	const {
		register,
		control,
		handleSubmit,
		formState: { errors },
		reset,
		watch,
	} = useForm({
		resolver: zodResolver(courseSchema),
		defaultValues: {
			title: "",
			description: "",
			price_cents: 0,
			currency: "usd",
			published: false,
			preview_image: null,
			teacher: "",
			category: "",
			lessons: [],
		}
	});
	
	const { fields: lessons, append: appendLesson, remove: removeLesson } = useFieldArray({
		control,
		name: "lessons"
	});
	
	useEffect(() => {
		dispatch(getCategories());
		dispatch(getTeachers());
	}, [dispatch])
	
	// Fetch course data
	useEffect(() => {
		dispatch(getCourseById({id})).then(({payload}) => {
			if (payload) {
				reset({
					title: payload?.title ?? "",
					description: payload?.description ?? "",
					price_cents: payload?.price_cents ?? "",
					currency: payload?.currency ?? "",
					published: payload?.published ?? false,
					teacher: payload?.teacher?.id?.toString() ?? "",
					category: payload?.category?.id?.toString() ?? "",
					lessons: payload?.lessons?.map(lesson => ({
						id: lesson.id,
						title: lesson.title,
						content: lesson.content || "",
						video_url: lesson.video_url || "",
						link: lesson.link || "",
						order_index: lesson.order_index,
						is_preview: lesson.is_preview || false,
						is_published: lesson.is_published || false,
					})) || [],
				});
			}
		})
	}, [dispatch, id]);
	
	const onSubmit = async (data) => {
		setIsLoading(true);
		setServerError("");
		
		try {
			const formData = new FormData();
			
			// Course basic info
			formData.append("title", data.title);
			formData.append("description", data.description);
			formData.append("price_cents", data.price_cents.toString());
			formData.append("currency", data.currency);
			formData.append("published", data.published.toString());
			formData.append("category", data.category_id);
			formData.append("teacher", data.teacher_id);
			
			// Handle preview image
			if (data.preview_image && data.preview_image instanceof File) {
				formData.append("preview_image", data.preview_image);
			}
			
			// Prepare lessons data
			const lessonsData = data.lessons.map((lesson, idx) => ({
				id: lesson.id, // For existing lessons
				title: lesson.title,
				content: lesson.content,
				link: lesson.link,
				order_index: lesson.order_index || idx + 1,
				is_preview: lesson.is_preview,
				is_published: lesson.is_published,
			}));
			
			formData.append("lessons", JSON.stringify(lessonsData));
			
			// Handle lesson videos
			data.lessons.forEach((lesson, index) => {
				if (lesson.video_file instanceof File) {
					formData.append(`lesson_videos`, lesson.video_file);
					formData.append(`lesson_video_indexes`, index.toString());
				}
			});
			
			const response = await instance.put(`/courses/${id}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			
			if (response.status === 200) {
				toast.success(`Course "${data.title}" updated successfully!`);
				navigate("/admin/courses");
			}
		} catch (error) {
			const errorMessage = error.response?.data?.error || error.message;
			setServerError(errorMessage);
			toast.error("Failed to update course");
		} finally {
			setIsLoading(false);
		}
	};
	
	const handleTabChange = (value) => {
		setActiveTab(value);
	};
	
	if (!course) {
		return (
			<div className="container mx-auto py-8 px-4 max-w-4xl">
				<div className="flex items-center justify-center">
					<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
				</div>
			</div>
		);
	}
	
	return (
		<div className="container mx-auto py-6 px-4 max-w-6xl">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-3xl font-bold">Update Course: {course.title}</h1>
				<Button variant="outline" onClick={() => navigate("/admin/courses")}>
					Back to Courses
				</Button>
			</div>
			
			{serverError && (
				<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
					<strong>Error:</strong> {serverError}
				</div>
			)}
			
			<Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="course">Course Information</TabsTrigger>
					<TabsTrigger value="lessons">Lessons Management</TabsTrigger>
				</TabsList>
				
				<form onSubmit={handleSubmit(onSubmit)}>
					{/* Course Information Tab */}
					<TabsContent value="course" className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Course Details</CardTitle>
							</CardHeader>
							<CardContent className="space-y-6">
								{/* Basic Information */}
								<div className="grid grid-cols-1 gap-6">
									<div className="flex flex-col gap-2">
										<Label>Course Title *</Label>
										<Input
											{...register("title")}
											placeholder="Enter course title"
											className={errors.title ? "border-red-500" : ""}
										/>
										{errors.title && (
											<p className="text-red-500 text-sm">{errors.title.message}</p>
										)}
									</div>
									
									<div className="flex flex-col gap-2">
										<Label>Description *</Label>
										<Textarea
											{...register("description")}
											placeholder="Detailed course description"
											rows={4}
											className={errors.description ? "border-red-500" : ""}
										/>
										{errors.description && (
											<p className="text-red-500 text-sm">{errors.description.message}</p>
										)}
									</div>
								</div>
								
								<div className="grid grid-cols-2 gap-4">
									<div className="flex flex-col gap-1">
										<Label htmlFor="course-category">Category *</Label>
										<Controller
											name="category"
											control={control}
											render={({field}) => (
												<Select
													value={field.value}
													onValueChange={field.onChange}
												>
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Select a category"/>
														<SelectContent>
															<SelectGroup>
																<SelectLabel>Categories</SelectLabel>
																{categories?.map((item) => (
																	<SelectItem key={item.id} value={item.id.toString()}>
																		{item.name}
																	</SelectItem>
																))}
															</SelectGroup>
														</SelectContent>
													</SelectTrigger>
												</Select>
											)}
										/>
										{errors.category && (
											<p className="text-red-500 text-sm">{errors.category.message}</p>
										)}
									</div>
									
									{getUserData().role === "admin" && (
										<div className="flex flex-col gap-1">
											<Label htmlFor="course-category">Teacher *</Label>
											<Controller
												name="teacher"
												control={control}
												render={({field}) => (
													<Select
														value={field.value}
														onValueChange={field.onChange}
													>
														<SelectTrigger className="w-full">
															<SelectValue placeholder="Select a teacher"/>
															<SelectContent>
																<SelectGroup>
																	<SelectLabel>Teachers</SelectLabel>
																	{teachers?.map((item) => (
																		<SelectItem key={item?.id} value={item?.id?.toString()}>
																			{item?.name}
																		</SelectItem>
																	))}
																</SelectGroup>
															</SelectContent>
														</SelectTrigger>
													</Select>
												)}
											/>
											{errors.category && (
												<p className="text-red-500 text-sm">{errors.category.message}</p>
											)}
										</div>
									)}
								</div>
								
								{/* Pricing */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="flex flex-col gap-2">
										<Label>Price (in cents) *</Label>
										<Input
											type="number"
											{...register("price_cents", { valueAsNumber: true })}
											placeholder="0"
											className={errors.price_cents ? "border-red-500" : ""}
										/>
										{errors.price_cents && (
											<p className="text-red-500 text-sm">{errors.price_cents.message}</p>
										)}
										<p className="text-sm text-gray-500">
											Actual price: ${(watch('price_cents') / 100).toFixed(2)}
										</p>
									</div>
									
									<div className="flex flex-col gap-2">
										<Label>Currency</Label>
										<Input {...register("currency")} readOnly className="bg-gray-100" />
									</div>
								</div>
								
								{/* Preview Image & Published Status */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="flex flex-col gap-2">
										<Label>Preview Image</Label>
										<Controller
											name="preview_image"
											control={control}
											render={({ field: { onChange, value } }) => (
												<div>
													<Input
														type="file"
														accept="image/*"
														onChange={(e) => onChange(e.target.files[0])}
													/>
													{course.preview_image && !value && (
														<div className="mt-2">
															<p className="text-sm text-gray-600 mb-1">Current Image:</p>
															<img
																src={instance.defaults.baseURL + course.preview_image}
																alt="Current preview"
																className="h-56 w-56 object-cover rounded-md"
															/>
														</div>
													)}
													{value && (
														<p className="text-sm text-green-600 mt-1">
															New image: {value.name}
														</p>
													)}
												</div>
											)}
										/>
									</div>
									
									<div className="flex flex-col gap-2">
										<Label>Publication Status</Label>
										<Controller
											name="published"
											control={control}
											render={({ field }) => (
												<div className="flex items-center gap-3 p-2 border rounded-lg">
													<Switch
														checked={field.value}
														onCheckedChange={field.onChange}
													/>
													<div>
														<Label className="font-medium">
															{field.value ? "Published" : "Draft"}
														</Label>
														<p className="text-sm text-gray-500">
															{field.value ? "Course is visible to students" : "Course is hidden"}
														</p>
													</div>
												</div>
											)}
										/>
									</div>
								</div>
							</CardContent>
						</Card>
						
						<div className="flex justify-end space-x-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => setActiveTab("lessons")}
							>
								Next: Lessons Management
							</Button>
						</div>
					</TabsContent>
					
					{/* Lessons Management Tab */}
					<TabsContent value="lessons" className="space-y-6">
						<Card>
							<CardHeader>
								<div className="flex items-center justify-between">
									<CardTitle>Course Lessons</CardTitle>
									<div className="text-sm text-gray-500">
										{lessons.length} lesson(s)
									</div>
								</div>
							</CardHeader>
							<CardContent className="space-y-6">
								{lessons.length === 0 ? (
									<div className="text-center py-8 text-gray-500">
										No lessons added yet. Start by adding your first lesson.
									</div>
								) : (
									lessons.map((lesson, index) => (
										<LessonSection
											key={lesson.id}
											control={control}
											register={register}
											lessonIndex={index}
											removeLesson={removeLesson}
											errors={errors}
											isExistingLesson={!!lesson.id}
										/>
									))
								)}
								
								<Button
									type="button"
									variant="outline"
									onClick={() =>
										appendLesson({
											title: "",
											content: "",
											video_url: "",
											link: "",
											order_index: lessons.length + 1,
											is_preview: false,
											is_published: false,
										})
									}
									className="w-full"
								>
									+ Add New Lesson
								</Button>
							</CardContent>
						</Card>
						
						<div className="flex justify-between space-x-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => setActiveTab("course")}
							>
								← Back to Course Info
							</Button>
							
							<div className="space-x-4">
								<Button
									type="button"
									variant="outline"
									onClick={() => reset()}
									disabled={isLoading}
								>
									Reset Changes
								</Button>
								<Button
									type="submit"
									disabled={isLoading}
								>
									{isLoading ? "Updating Course..." : "Update Course"}
								</Button>
							</div>
						</div>
					</TabsContent>
				</form>
			</Tabs>
		</div>
	);
}