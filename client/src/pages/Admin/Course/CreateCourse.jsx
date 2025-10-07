import {useForm, useFieldArray, Controller} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import React, {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Textarea} from "@/components/ui/textarea";
import {Label} from "@/components/ui/label";
import instance from "@/utils/axios.js";
import {Switch} from "@/components/ui/switch.jsx";
import {useNavigate, useParams} from "react-router-dom";
import toast from "react-hot-toast";
import {getUserData} from "@/auth/jwtService.js";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select.jsx";
import {useDispatch, useSelector} from "react-redux";
import {getCategories} from "@/features/category/categorySlice.js";
import {getTeachers} from "@/features/admin/adminSlice.js";
import {getCourseById} from "@/features/course/courseSlice.js";

// Validation schemas
const lessonSchema = z.object({
	title: z.string().min(1, "Lesson title is required"),
	content: z.string().optional(),
	link: z.string().url("Must be a valid URL").optional().or(z.literal("")),
	video: z.any()
		.refine((file) => {
			if (file instanceof File) {
				return file.size > 0;
			}
			
			return false;
		}, "Video file is required")
		.refine((file) => {
			if (!file || !(file instanceof File)) return false;
			
			
			const allowedTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/webm', 'video/mkv'];
			return allowedTypes.includes(file.type);
		}, "Only video files are allowed (MP4, MOV, AVI, WEBM, MKV)")
		.refine((file) => {
			if (!file || !(file instanceof File)) return false;
			
			const maxSize = 100 * 1024 * 1024;
			return file.size <= maxSize;
		}, "File size must be less than 100MB"),
	order_index: z.number(),
});

const chapterSchema = z.object({
	title: z.string().min(1, "Chapter title is required"),
	order_index: z.number(),
	lessons: z.array(lessonSchema).min(1, "At least one lesson is required"),
});

const courseSchema = z.object({
	title: z.string().min(1, "Course title is required"),
	description: z.string().min(1, "Description is required"),
	price_cents: z.number().min(0, "Price must be positive"),
	currency: z.string().min(1, "Currency is required"),
	chapters: z.array(chapterSchema).min(1, "At least one chapter is required"),
	published: z.boolean().default(false),
	preview: z.any().optional(),
	category: z.string().min(0, "Category is required"),
	teacher: z.string().min(0, "Teacher is required"),
});

const updateCourseSchema = z.object({
	title: z.string().min(1, "Course title is required"),
	description: z.string().min(1, "Description is required"),
	price_cents: z.number().min(0, "Price must be positive"),
	currency: z.string().min(1, "Currency is required"),
	published: z.boolean().default(false),
	preview: z.any().optional(),
	category: z.string().min(1, "Category is required"),
	teacher: z.string().min(1, "Teacher is required"),
});

// Lesson Section Component
const LessonSection = ({control, register, chapterIndex, lessonIndex, removeLesson, errors}) => {
	
	return (
		<Card className="border border-gray-200 p-4 bg-white mb-4">
			<CardHeader className="flex flex-row justify-between items-center p-0 pb-4">
				<CardTitle className="text-lg">Lesson {lessonIndex + 1}</CardTitle>
				<Button
					type="button"
					variant="destructive"
					size="sm"
					onClick={() => removeLesson(lessonIndex)}
				>
					Remove Lesson
				</Button>
			</CardHeader>
			
			<CardContent className="p-0 space-y-4">
				{/* Lesson Title */}
				<div className="flex flex-col gap-1">
					<Label htmlFor={`chapter-${chapterIndex}-lesson-${lessonIndex}-title`}>
						Lesson Title *
					</Label>
					<Input
						id={`chapter-${chapterIndex}-lesson-${lessonIndex}-title`}
						{...register(`chapters.${chapterIndex}.lessons.${lessonIndex}.title`)}
						placeholder="Enter lesson title"
						className={errors?.chapters?.[chapterIndex]?.lessons?.[lessonIndex]?.title ? "border-red-500" : ""}
					/>
					{errors?.chapters?.[chapterIndex]?.lessons?.[lessonIndex]?.title && (
						<p className="text-red-500 text-sm mt-1">
							{errors.chapters[chapterIndex].lessons[lessonIndex].title.message}
						</p>
					)}
				</div>
				
				{/* Lesson Content */}
				<div className="flex flex-col gap-1">
					<Label htmlFor={`chapter-${chapterIndex}-lesson-${lessonIndex}-content`}>
						Content
					</Label>
					<Textarea
						id={`chapter-${chapterIndex}-lesson-${lessonIndex}-content`}
						{...register(`chapters.${chapterIndex}.lessons.${lessonIndex}.content`)}
						placeholder="Lesson content or description"
						rows={3}
					/>
				</div>
				
				{/* Lesson Link */}
				<div className="flex flex-col gap-1">
					<Label htmlFor={`chapter-${chapterIndex}-lesson-${lessonIndex}-link`}>
						External Link
					</Label>
					<Input
						id={`chapter-${chapterIndex}-lesson-${lessonIndex}-link`}
						{...register(`chapters.${chapterIndex}.lessons.${lessonIndex}.link`)}
						placeholder="https://example.com"
						className={errors?.chapters?.[chapterIndex]?.lessons?.[lessonIndex]?.link ? "border-red-500" : ""}
					/>
					{errors?.chapters?.[chapterIndex]?.lessons?.[lessonIndex]?.link && (
						<p className="text-red-500 text-sm mt-1">
							{errors.chapters[chapterIndex].lessons[lessonIndex].link.message}
						</p>
					)}
				</div>
				
				{/* Video Upload */}
				<div className="flex flex-col gap-1">
					<Label htmlFor={`chapter-${chapterIndex}-lesson-${lessonIndex}-video`}>
						Video File
					</Label>
					<Controller
						control={control}
						name={`chapters.${chapterIndex}.lessons.${lessonIndex}.video`}
						render={({field: {onChange, value, ...field}, fieldState: {error}}) => (
							<div>
								<Input
									id={`chapter-${chapterIndex}-lesson-${lessonIndex}-video`}
									type="file"
									accept="video/mp4,video/mov,video/avi,video/webm,video/mkv"
									onChange={(e) => onChange(e.target.files[0])}
									className={error ? "border-red-500" : ""}
									{...field}
								/>
								{value && (
									<p className="text-sm text-green-600 mt-1">
										Selected: {value.name}
									</p>
								)}
								{error && (
									<p className="text-red-500 text-sm mt-1">{error.message}</p>
								)}
								<p className="text-sm text-gray-500 mt-1">
									Supported formats: MP4, MOV, AVI, WEBM, MKV (max 100MB)
								</p>
							</div>
						)}
					/>
				</div>
			</CardContent>
		</Card>
	);
};

// Chapter Section Component
const ChapterSection = ({control, register, chapterIndex, removeChapter, errors}) => {
	const {fields: lessons, append: appendLesson, remove: removeLesson} = useFieldArray({
		control,
		name: `chapters.${chapterIndex}.lessons`
	});
	
	return (
		<Card className="border border-gray-300 bg-gray-50 mb-6">
			<CardHeader className="flex flex-row justify-between items-center">
				<CardTitle>Chapter {chapterIndex + 1}</CardTitle>
				<Button
					type="button"
					variant="destructive"
					size="sm"
					onClick={() => removeChapter(chapterIndex)}
				>
					Remove Chapter
				</Button>
			</CardHeader>
			
			<CardContent className="space-y-4">
				{/* Chapter Title */}
				<div className="flex flex-col gap-1">
					<Label htmlFor={`chapter-${chapterIndex}-title`}>
						Chapter Title *
					</Label>
					<Input
						id={`chapter-${chapterIndex}-title`}
						{...register(`chapters.${chapterIndex}.title`)}
						placeholder="Enter chapter title"
						className={errors?.chapters?.[chapterIndex]?.title ? "border-red-500" : ""}
					/>
					{errors?.chapters?.[chapterIndex]?.title && (
						<p className="text-red-500 text-sm mt-1">
							{errors.chapters[chapterIndex].title.message}
						</p>
					)}
				</div>
				
				{/* Lessons */}
				<div className="space-y-4">
					<Label>Lessons *</Label>
					{lessons.map((lesson, lessonIndex) => (
						<LessonSection
							key={lesson.id}
							control={control}
							register={register}
							chapterIndex={chapterIndex}
							lessonIndex={lessonIndex}
							removeLesson={removeLesson}
							errors={errors}
						/>
					))}
					
					<Button
						type="button"
						size="sm"
						onClick={() => appendLesson({
							title: "",
							content: "",
							link: "",
							order_index: lessons.length + 1,
							video: null
						})}
					>
						Add Lesson
					</Button>
				</div>
			</CardContent>
		</Card>
	);
};

// Main Component
export default function CreateCourse() {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	
	const {id} = useParams()
	
	const {categories} = useSelector(state => state.category)
	const {teachers} = useSelector(state => state.admin)
	
	const [isLoading, setIsLoading] = useState(false);
	const [serverError, setServerError] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	
	const {
		register,
		control,
		handleSubmit,
		getValues,
		formState: {errors},
		reset
	} = useForm({
		resolver: zodResolver(id === "id" ? courseSchema : updateCourseSchema),
		defaultValues: {
			title: "",
			description: "",
			price_cents: 0,
			currency: "usd",
			published: false,
			preview: null,
			teacher: "",
			category: "",
			chapters: [
				{
					title: "",
					order_index: 1,
					lessons: [{
						title: "",
						content: "",
						link: "",
						order_index: 1,
						video: null
					}]
				}
			]
		}
	});
	
	const {fields: chapters, append: appendChapter, remove: removeChapter} = useFieldArray({
		control,
		name: "chapters"
	});
	
	useEffect(() => {
		dispatch(getCategories())
		dispatch(getTeachers())
	}, [dispatch])
	
	useEffect(() => {
		if (id !== "id") {
			dispatch(getCourseById({id})).then(({payload}) => {
				if (payload) {
					reset({
						title: payload?.title ?? "",
						description: payload?.description ?? "",
						category: payload?.category?.id ?? "",
						teacher: payload?.teacher?.id ?? "",
						published: payload?.published ?? false,
						preview: payload?.preview_image ?? "",
						price_cents: payload?.price_cents ?? 0
					})
				}
			})
		}
	}, [dispatch, id])
	
	const onSubmit = async (data) => {
		setIsLoading(true);
		setServerError("");
		setSuccessMessage("");
		
		try {
			const formData = new FormData();
			
			// Basic course fields
			formData.append("title", data.title);
			formData.append("description", data.description);
			formData.append("price_cents", data.price_cents.toString());
			formData.append("currency", data.currency);
			formData.append("published", data.published.toString())
			
			formData.append("category_id", data.category.toString());
			if (data.teacher) {
				formData.append("teacher_id", data.teacher.toString());
			}
			
			if (data.preview && data.preview instanceof File) {
				formData.append("preview", data.preview);
			} else {
				formData.append("preview", "");
			}
			
			// Prepare chapters data - remove video files from JSON
			if (id === "id") {
				const chaptersWithOrder = data.chapters.map((ch, chapterIdx) => ({
					title: ch.title,
					order_index: chapterIdx + 1,
					lessons: ch.lessons.map((les, lessonIdx) => ({
						title: les.title,
						content: les.content,
						link: les.link,
						order_index: lessonIdx + 1
						// video is excluded from JSON
					}))
				}));
				formData.append("chapters", JSON.stringify(chaptersWithOrder));
				
				// Add video files
				data.chapters.forEach((ch) => {
					ch.lessons.forEach((les) => {
						if (les.video && les.video instanceof File) {
							formData.append("lessonsVideo", les.video);
						}
					});
				});
			}
			
			if (id === "id") {
				await instance.post("/courses/full", formData, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}).then((response) => {
					if (response.status === 201) {
						toast.success(`Course "${data.title}" created successfully! Course ID: ${response.data.courseId}`)
						navigate("/admin/courses")
					}
				})
			} else {
				await instance.put(`/courses/${id}`, formData, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}).then((response) => {
					if (response.status === 201) {
						toast.success(`Course "${data.title}" updated successfully! Course ID: ${response.data.id}`)
						navigate("/admin/courses")
					}
				})
			}
			
			reset();
			
		} catch (error) {
			console.error("Course creation failed:", error);
			const errorMessage = error.response?.data?.error || error.message || "Failed to create course";
			setServerError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};
	
	return (
		<div className="container mx-auto py-3 px-4 max-w-4xl">
			<div className="mb-6">
				<h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
				<p className="text-gray-600 mt-2">
					Create a complete course with chapters and lessons
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
			
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
				{/* Course Basic Information */}
				<Card>
					<CardHeader>
						<CardTitle>Course Information</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{/* Course Title */}
						<div className="flex flex-col gap-1">
							<Label htmlFor="course-title">Course Title *</Label>
							<Input
								id="course-title"
								{...register("title")}
								placeholder="Enter course title"
								className={errors.title ? "border-red-500" : ""}
							/>
							{errors.title && (
								<p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
							)}
						</div>
						
						{/* Course Description */}
						<div className="flex flex-col gap-1">
							<Label htmlFor="course-description">Description *</Label>
							<Textarea
								id="course-description"
								{...register("description")}
								placeholder="Describe your course"
								rows={4}
								className={errors.description ? "border-red-500" : ""}
							/>
							{errors.description && (
								<p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
							)}
						</div>
						
						{/*category and teacher*/}
						{getUserData().role === "admin" && (
							<div className="grid grid-cols-2 gap-4">
								<div className="flex flex-col gap-1">
									<Label htmlFor="course-category">Category</Label>
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
								
								<div className="flex flex-col gap-1">
									<Label htmlFor="course-category">Teacher</Label>
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
							</div>
						)}
						
						{/* Price and Currency */}
						<div className="grid grid-cols-2 gap-4">
							<div className="flex flex-col gap-1">
								<Label htmlFor="course-price">Price (cents) *</Label>
								<Input
									id="course-price"
									type="number"
									{...register("price_cents", {valueAsNumber: true})}
									placeholder="0"
									className={errors.price_cents ? "border-red-500" : ""}
								/>
								{errors.price_cents && (
									<p className="text-red-500 text-sm mt-1">{errors.price_cents.message}</p>
								)}
							</div>
							
							<div className="flex flex-col gap-1">
								<Label htmlFor="course-currency">Currency *</Label>
								<Input
									id="course-currency"
									{...register("currency")}
									placeholder="usd"
									className={errors.currency ? "border-red-500" : ""}
									readOnly
								/>
								{errors.currency && (
									<p className="text-red-500 text-sm mt-1">{errors.currency.message}</p>
								)}
							</div>
							
							<Controller
								id={"published"}
								name="published"
								control={control}
								defaultValue={false}
								render={({field}) => (
									<div className="flex items-center gap-2">
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
										<Label>Published</Label>
									</div>
								)}
							/>
							
							<div className="flex flex-col gap-1">
								<Label>Preview Image</Label>
								<Controller
									name="preview"
									control={control}
									render={({field: {onChange, value}}) => (
										<div>
											<Input
												id="preview-image"
												type="file"
												accept="image/*"
												onChange={(e) => onChange(e.target.files[0])}
											/>
											{value && (
												<p className="text-sm text-green-600 mt-1">
													Selected: {value.name}
												</p>
											)}
										</div>
									)}
								/>
							</div>
						</div>
						{id !== "id" && getValues("preview") && (
							<div className="w-full ml-auto">
								<img
									src={instance.defaults.baseURL + getValues("preview")}
									alt={"img"}
									className="w-full h-40 object-cover rounded-lg"
								/>
							</div>
						)}
					</CardContent>
				</Card>
				
				{/* Chapters Section */}
				{id === "id" && (
					<Card>
						<CardHeader>
							<CardTitle>Course Chapters</CardTitle>
						</CardHeader>
						<CardContent className="space-y-6">
							{chapters.map((chapter, chapterIndex) => (
								<ChapterSection
									key={chapter.id}
									control={control}
									register={register}
									chapter={chapter}
									chapterIndex={chapterIndex}
									removeChapter={removeChapter}
									errors={errors}
								/>
							))}
							
							{errors.chapters && (
								<p className="text-red-500 text-sm">
									{errors.chapters.message}
								</p>
							)}
							
							<Button
								type="button"
								onClick={() => appendChapter({
									title: "",
									order_index: chapters.length + 1,
									lessons: [{
										title: "",
										content: "",
										link: "",
										order_index: 1,
										video: null
									}]
								})}
							>
								Add Chapter
							</Button>
						</CardContent>
					</Card>
				)}
				
				{/* Submit Button */}
				<div className="flex justify-end space-x-4 pt-6 border-t">
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
								Creating...
							</>
						) : (
							id === "id" ? "Create Course" : "Update Course"
						)}
					</Button>
				</div>
			</form>
		</div>
	);
}