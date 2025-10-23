// import {useForm, useFieldArray, Controller} from "react-hook-form";
// import {zodResolver} from "@hookform/resolvers/zod";
// import {z} from "zod";
// import React, {useEffect, useState} from "react";
// import {Button} from "@/components/ui/button";
// import {Input} from "@/components/ui/input";
// import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
// import {Textarea} from "@/components/ui/textarea";
// import {Label} from "@/components/ui/label";
// import instance from "@/utils/axios.js";
// import {Switch} from "@/components/ui/switch.jsx";
// import {useNavigate, useParams} from "react-router-dom";
// import toast from "react-hot-toast";
// import {
// 	Select,
// 	SelectContent,
// 	SelectGroup,
// 	SelectItem,
// 	SelectLabel,
// 	SelectTrigger,
// 	SelectValue
// } from "@/components/ui/select.jsx";
// import {useDispatch, useSelector} from "react-redux";
// import {getCategories} from "@/features/category/categorySlice.js";
// import {getTeachers} from "@/features/admin/adminSlice.js";
// import {getUserData} from "@/auth/jwtService.js";
// import {getCourseById} from "@/features/course/courseSlice.js";
//
// // Validation schema
// const lessonSchema = z.object({
// 	title: z.string().min(1, "Lesson title is required"),
// 	content: z.string().optional(),
// 	link: z.string().url("Must be a valid URL").optional().or(z.literal("")),
// 	video: z.any()
// 		.optional()
// 		.refine((file) => file instanceof File && file?.size > 0, "Video file is required")
// 		.refine((file) => {
// 			if (!(file instanceof File)) return false;
// 			const allowedTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/webm', 'video/mkv'];
// 			return allowedTypes.includes(file.type);
// 		}, "Only video files are allowed (MP4, MOV, AVI, WEBM, MKV)")
// 		.refine((file) => file?.size <= 100 * 1024 * 1024, "File size must be less than 100MB"),
// 	order_index: z.number(),
// 	video_url: z.string().optional(),
// 	is_preview: z.boolean().default(false),
// 	is_published: z.boolean().default(false),
// });
//
// const courseSchema = z.object({
// 	title: z.string().min(1, "Course title is required"),
// 	description: z.string().min(1, "Description is required"),
// 	price_cents: z.number().min(0, "Price must be positive"),
// 	currency: z.string().min(1, "Currency is required"),
// 	lessons: z.array(lessonSchema).min(1, "At least one lesson is required"),
// 	published: z.boolean().default(false),
// 	preview: z.any().optional(),
// 	category: z.string().min(1, "Category is required"),
// 	teacher: z.string().min(1, "Teacher is required"),
// });
//
// const LessonSection = ({control, register, lessonIndex, removeLesson, errors, isExistingLesson}) => (
// 	<Card className="border border-gray-200 p-4 bg-white mb-4">
// 		<CardHeader className="flex flex-row justify-between items-center p-0 pb-4">
// 			<CardTitle className="text-lg">Lesson {lessonIndex + 1}</CardTitle>
// 			<Button
// 				type="button"
// 				variant="destructive"
// 				size="sm"
// 				disabled={isExistingLesson}
// 				onClick={() => removeLesson(lessonIndex)}
// 			>
// 				Remove
// 			</Button>
// 		</CardHeader>
//
// 		<CardContent className="p-0 space-y-4">
// 			{/* Title */}
// 			<div className="flex flex-col gap-1">
// 				<Label>Lesson Title *</Label>
// 				<Input
// 					{...register(`lessons.${lessonIndex}.title`)}
// 					placeholder="Enter lesson title"
// 					className={errors?.lessons?.[lessonIndex]?.title ? "border-red-500" : ""}
// 				/>
// 				{errors?.lessons?.[lessonIndex]?.title && (
// 					<p className="text-red-500 text-sm">
// 						{errors.lessons[lessonIndex].title.message}
// 					</p>
// 				)}
// 			</div>
//
// 			{/* Content */}
// 			<div className="flex flex-col gap-1">
// 				<Label>Content</Label>
// 				<Textarea
// 					{...register(`lessons.${lessonIndex}.content`)}
// 					placeholder="Lesson description"
// 					rows={3}
// 				/>
// 			</div>
//
// 			{/* Link */}
// 			<div className="flex flex-col gap-1">
// 				<Label>External Link</Label>
// 				<Input
// 					{...register(`lessons.${lessonIndex}.link`)}
// 					placeholder="https://example.com"
// 					className={errors?.lessons?.[lessonIndex]?.link ? "border-red-500" : ""}
// 				/>
// 				{errors?.lessons?.[lessonIndex]?.link && (
// 					<p className="text-red-500 text-sm">{errors.lessons[lessonIndex].link.message}</p>
// 				)}
// 			</div>
//
// 			{/* Video */}
// 			<div className="space-y-2">
// 				<Label>Video</Label>
//
// 				{/* Existing Video */}
// 				{isExistingLesson && (
// 					<Controller
// 						control={control}
// 						name={`lessons.${lessonIndex}.video_url`}
// 						render={({field: {value}}) => (
// 							value && (
// 								<div className="bg-gray-50 p-3 rounded-md">
// 									<p className="text-sm text-gray-600 mb-2">Current Video:</p>
// 									<a
// 										href={value}
// 										target="_blank"
// 										rel="noopener noreferrer"
// 										className="text-blue-600 hover:underline text-sm"
// 									>
// 										{value}
// 									</a>
// 								</div>
// 							)
// 						)}
// 					/>
// 				)}
//
// 				{/* New Video Upload */}
// 				<Controller
// 					control={control}
// 					name={`lessons.${lessonIndex}.video`}
// 					render={({field: {onChange, value}, fieldState: {error}}) => (
// 						<div>
// 							<Label className="text-sm text-gray-600">
// 								{isExistingLesson ? "Replace Video (Optional)" : "Upload Video *"}
// 							</Label>
// 							<Input
// 								type="file"
// 								accept="video/*"
// 								onChange={(e) => onChange(e.target.files[0])}
// 								className={error ? "border-red-500" : ""}
// 							/>
// 							{value && (
// 								<p className="text-sm text-green-600 mt-1">
// 									Selected: {value.name}
// 								</p>
// 							)}
// 							{error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
// 						</div>
// 					)}
// 				/>
// 			</div>
//
// 			<div className="flex flex-col gap-4">
// 				<Controller
// 					control={control}
// 					name={`lessons.${lessonIndex}.is_preview`}
// 					render={({field}) => (
// 						<div className="flex items-center gap-2">
// 							<Switch
// 								checked={field.value}
// 								onCheckedChange={field.onChange}
// 							/>
// 							<Label>Preview Lesson (Free access)</Label>
// 						</div>
// 					)}
// 				/>
//
// 				<Controller
// 					control={control}
// 					name={`lessons.${lessonIndex}.is_published`}
// 					render={({field}) => (
// 						<div className="flex items-center gap-2">
// 							<Switch
// 								checked={field.value}
// 								onCheckedChange={field.onChange}
// 							/>
// 							<Label>Published</Label>
// 						</div>
// 					)}
// 				/>
// 			</div>
// 		</CardContent>
// 	</Card>
// );
//
// export default function CreateCourse() {
// 	const navigate = useNavigate();
// 	const dispatch = useDispatch();
//
// 	const {id} = useParams()
//
// 	const {categories} = useSelector(state => state.category);
// 	const {teachers} = useSelector(state => state.admin);
//
// 	const {course} = useSelector(state => state.course)
//
// 	const [isLoading, setIsLoading] = useState(false);
// 	const [serverError, setServerError] = useState("");
//
// 	const {
// 		register,
// 		control,
// 		handleSubmit,
// 		formState: {errors},
// 		reset,
// 	} = useForm({
// 		resolver: zodResolver(courseSchema),
// 		defaultValues: {
// 			title: "",
// 			description: "",
// 			price_cents: 0,
// 			currency: "usd",
// 			published: false,
// 			preview: null,
// 			teacher: "",
// 			category: "",
// 			lessons: [{title: "", content: "", link: "", video: null, order_index: 1}],
// 		}
// 	});
//
// 	const {fields: lessons, append: appendLesson, remove: removeLesson} = useFieldArray({
// 		control,
// 		name: "lessons"
// 	});
//
// 	useEffect(() => {
// 		dispatch(getCategories());
// 		dispatch(getTeachers());
// 	}, [dispatch]);
//
// 	useEffect(() => {
// 		if (id) {
// 			dispatch(getCourseById({id})).then(({payload}) => {
// 				if (payload) {
// 					reset({
// 						title: payload?.title ?? "",
// 						description: payload?.description ?? "",
// 						price_cents: payload?.price_cents ?? "",
// 						currency: payload?.currency ?? "",
// 						published: payload?.published ?? false,
// 						teacher: payload?.teacher?.id?.toString() ?? "",
// 						category: payload?.category?.id?.toString() ?? "",
// 						lessons: payload?.lessons?.map(lesson => ({
// 							id: lesson.id,
// 							title: lesson.title,
// 							content: lesson.content || "",
// 							video_url: lesson.video_url || "",
// 							link: lesson.link || "",
// 							is_preview: lesson.is_preview || false,
// 							is_published: lesson.is_published || false,
// 							video: null
// 						})) || [],
// 					});
// 				}
// 			})
// 		}
// 	}, [dispatch, id]);
//
// 	const onSubmit = async (data) => {
// 		setIsLoading(true);
// 		setServerError("");
//
// 		console.log(data)
//
// 		try {
// 			const formData = new FormData();
// 			formData.append("title", data.title);
// 			formData.append("description", data.description);
// 			formData.append("price_cents", data.price_cents.toString());
// 			formData.append("currency", data.currency);
// 			formData.append("published", data.published.toString());
// 			formData.append("category", data.category);
// 			formData.append("teacher", data.teacher);
//
// 			if (data.preview && data.preview instanceof File) {
// 				formData.append("preview", data.preview);
// 			}
//
// 			// Lessons ma'lumotlarini tayyorlash
// 			const lessonsJSON = data.lessons.map((l, idx) => ({
// 				id: l.id || null, // Mavjud lessonlar uchun ID
// 				title: l.title,
// 				content: l.content,
// 				link: l.link,
// 				order_index: idx + 1,
// 				is_preview: l.is_preview || false,
// 				is_published: l.is_published || false,
// 				video_url: l.video_url || null, // Mavjud video URL
// 			}));
//
// 			formData.append("lessons", JSON.stringify(lessonsJSON));
//
// 			// Yangi video fayllarni qo'shish
// 			data.lessons.forEach((l, index) => {
// 				if (l.video_file && l.video_file instanceof File) {
// 					formData.append("lessonsVideo", l.video);
// 				}
// 			});
//
// 			// URL va methodni IDga qarab o'zgartirish
// 			const url = id ? `/courses/full/${id}` : "/courses/full";
// 			const method = id ? "put" : "post";
//
// 			const response = await instance({
// 				method,
// 				url,
// 				data: formData,
// 				headers: {
// 					'Content-Type': 'multipart/form-data'
// 				}
// 			});
//
// 			if (response.status === (id ? 200 : 201)) {
// 				toast.success(`Course "${data.title}" ${id ? "updated" : "created"} successfully!`);
// 				navigate("/admin/courses");
// 			}
// 		} catch (error) {
// 			setServerError(error.response?.data?.error || error.message);
// 		} finally {
// 			setIsLoading(false);
// 		}
// 	};
//
// 	return (
// 		<div className="container mx-auto py-3 px-4 max-w-4xl">
// 			<h1 className="text-3xl font-bold mb-6">{id ? "Update" : "Create"} Course</h1>
//
// 			{serverError && (
// 				<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
// 					<strong>Error:</strong> {serverError}
// 				</div>
// 			)}
//
// 			<form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
// 				{/* Course info */}
// 				<Card>
// 					<CardHeader>
// 						<CardTitle>Course Information</CardTitle>
// 					</CardHeader>
// 					<CardContent className="space-y-4">
// 						<div className="flex flex-col gap-1">
// 							<Label>Course Title *</Label>
// 							<Input {...register("title")} placeholder="Enter title" className={errors.title ? "border-red-500" : ""}/>
// 							{errors.title && (
// 								<p className="text-red-500 text-sm">{errors.title.message}</p>
// 							)}
// 						</div>
//
// 						<div className="flex flex-col gap-1">
// 							<Label>Description *</Label>
// 							<Textarea {...register("description")} placeholder="Course description" rows={3}/>
// 						</div>
//
// 						{/* Category & Teacher */}
// 						<div className="grid grid-cols-2 gap-4">
// 							<div className="flex flex-col gap-1">
// 								<Label htmlFor="course-category">Category</Label>
// 								<Controller
// 									name="category"
// 									control={control}
// 									render={({field}) => (
// 										<Select
// 											value={field.value}
// 											onValueChange={field.onChange}
// 										>
// 											<SelectTrigger className="w-full">
// 												<SelectValue placeholder="Select a category"/>
// 												<SelectContent>
// 													<SelectGroup>
// 														<SelectLabel>Categories</SelectLabel>
// 														{categories?.map((item) => (
// 															<SelectItem key={item.id} value={item.id.toString()}>
// 																{item.name}
// 															</SelectItem>
// 														))}
// 													</SelectGroup>
// 												</SelectContent>
// 											</SelectTrigger>
// 										</Select>
// 									)}
// 								/>
// 								{errors.category && (
// 									<p className="text-red-500 text-sm">{errors.category.message}</p>
// 								)}
// 							</div>
//
// 							{getUserData().role === "admin" && (
// 								<div className="flex flex-col gap-1">
// 									<Label htmlFor="course-category">Teacher</Label>
// 									<Controller
// 										name="teacher"
// 										control={control}
// 										render={({field}) => (
// 											<Select
// 												value={field.value}
// 												onValueChange={field.onChange}
// 											>
// 												<SelectTrigger className="w-full">
// 													<SelectValue placeholder="Select a teacher"/>
// 													<SelectContent>
// 														<SelectGroup>
// 															<SelectLabel>Teachers</SelectLabel>
// 															{teachers?.map((item) => (
// 																<SelectItem key={item?.id} value={item?.id?.toString()}>
// 																	{item?.name}
// 																</SelectItem>
// 															))}
// 														</SelectGroup>
// 													</SelectContent>
// 												</SelectTrigger>
// 											</Select>
// 										)}
// 									/>
// 									{errors.category && (
// 										<p className="text-red-500 text-sm">{errors.category.message}</p>
// 									)}
// 								</div>
// 							)}
// 						</div>
//
// 						{/* Price, currency, published */}
// 						<div className="grid grid-cols-2 gap-4">
// 							<Input type="number" {...register("price_cents", {valueAsNumber: true})} placeholder="Price (cents)"/>
// 							<Input {...register("currency")} readOnly/>
// 						</div>
//
// 						<div className="flex flex-col gap-2">
// 							<Label>Publication Status</Label>
// 							<Controller
// 								name="published"
// 								control={control}
// 								render={({field}) => (
// 									<div className="flex items-center gap-3 p-2 border rounded-lg">
// 										<Switch
// 											checked={field.value}
// 											onCheckedChange={field.onChange}
// 										/>
// 										<div>
// 											<Label className="font-medium">
// 												{field.value ? "Published" : "Draft"}
// 											</Label>
// 											<p className="text-sm text-gray-500">
// 												{field.value ? "Course is visible to students" : "Course is hidden"}
// 											</p>
// 										</div>
// 									</div>
// 								)}
// 							/>
// 						</div>
//
// 						{/* Preview */}
// 						<Controller
// 							name="preview"
// 							control={control}
// 							render={({field: {onChange, value}}) => (
// 								<div>
// 									<Label>Preview Image</Label>
// 									<Input type="file" accept="image/*" onChange={(e) => onChange(e.target.files[0])}/>
//
// 									{course?.preview_image && !value && (
// 										<div className="mt-2">
// 											<p className="text-sm text-gray-600 mb-1">Current Image:</p>
// 											<img
// 												src={instance.defaults.baseURL + course?.preview_image}
// 												alt="Current preview"
// 												className="h-56 w-56 object-cover rounded-md"
// 											/>
// 										</div>
// 									)}
// 								</div>
// 							)}
// 						/>
// 					</CardContent>
// 				</Card>
//
// 				{/* Lessons */}
// 				<Card>
// 					<CardHeader><CardTitle>Lessons</CardTitle></CardHeader>
// 					<CardContent className="space-y-6">
// 						{lessons.map((lesson, i) => (
// 							<LessonSection
// 								key={lesson.id}
// 								control={control}
// 								register={register}
// 								lessonIndex={i}
// 								removeLesson={removeLesson}
// 								errors={errors}
// 								isExistingLesson={id}
// 							/>
// 						))}
// 						<Button
// 							type="button"
// 							onClick={() =>
// 								appendLesson({title: "", content: "", link: "", video: null, order_index: lessons.length + 1})
// 							}
// 						>
// 							Add Lesson
// 						</Button>
// 					</CardContent>
// 				</Card>
//
// 				{/* Submit */}
// 				<div className="flex justify-end pt-6 border-t space-x-4">
// 					<Button type="button" variant="outline" onClick={() => reset()} disabled={isLoading}>Reset</Button>
// 					<Button type="submit" disabled={isLoading}>
// 						{id ? "Update" : "Create"} Course
// 					</Button>
// 				</div>
// 			</form>
// 		</div>
// 	);
// }

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
import {getUserData} from "@/auth/jwtService.js";
import {getCourseById} from "@/features/course/courseSlice.js";

// Validation schema — video is optional (because on update we may have video_url)
const lessonSchema = z.object({
	title: z.string().min(1, "Lesson title is required"),
	content: z.string().optional(),
	link: z.string().optional().or(z.literal("")),
	video: z.any().optional(), // optional file
	order_index: z.number().optional(),
	video_url: z.string().optional(),
	is_preview: z.boolean().optional().default(false),
	is_published: z.boolean().optional().default(false),
});

const courseSchema = z.object({
	title: z.string().min(1, "Course title is required"),
	description: z.string().min(1, "Description is required"),
	price_cents: z.number().min(0, "Price must be positive"),
	currency: z.string().min(1, "Currency is required"),
	lessons: z.array(lessonSchema).min(1, "At least one lesson is required"),
	published: z.boolean().optional().default(false),
	preview: z.any().optional(),
	category: z.string().min(1, "Category is required"),
	teacher: z.string().min(1, "Teacher is required"),
});

const LessonSection = ({control, register, lessonIndex, removeLesson, errors, isExistingLesson}) => (
	<Card className="border border-gray-200 p-4 bg-white mb-4">
		<CardHeader className="flex flex-row justify-between items-center p-0 pb-4">
			<CardTitle className="text-lg">Lesson {lessonIndex + 1}</CardTitle>
			<Button
				type="button"
				variant="destructive"
				size="sm"
				disabled={isExistingLesson}
				onClick={() => removeLesson(lessonIndex)}
			>
				Remove
			</Button>
		</CardHeader>
		
		<CardContent className="p-0 space-y-4">
			{/* Title */}
			<div className="flex flex-col gap-1">
				<Label>Lesson Title *</Label>
				<Input
					{...register(`lessons.${lessonIndex}.title`)}
					placeholder="Enter lesson title"
					className={errors?.lessons?.[lessonIndex]?.title ? "border-red-500" : ""}
				/>
				{errors?.lessons?.[lessonIndex]?.title && (
					<p className="text-red-500 text-sm">{errors.lessons[lessonIndex].title.message}</p>
				)}
			</div>
			
			{/* Content */}
			<div className="flex flex-col gap-1">
				<Label>Content</Label>
				<Textarea
					{...register(`lessons.${lessonIndex}.content`)}
					placeholder="Lesson description"
					rows={3}
				/>
			</div>
			
			{/* Link */}
			<div className="flex flex-col gap-1">
				<Label>External Link</Label>
				<Input
					{...register(`lessons.${lessonIndex}.link`)}
					placeholder="https://example.com"
					className={errors?.lessons?.[lessonIndex]?.link ? "border-red-500" : ""}
				/>
				{errors?.lessons?.[lessonIndex]?.link && (
					<p className="text-red-500 text-sm">{errors.lessons[lessonIndex].link.message}</p>
				)}
			</div>
			
			{/* Video */}
			<div className="space-y-2">
				<Label>Video</Label>
				
				{/* Existing Video URL */}
				<Controller
					control={control}
					name={`lessons.${lessonIndex}.video_url`}
					render={({field: {value}}) => (
						value ? (
							<div className="bg-gray-50 p-3 rounded-md">
								<p className="text-sm text-gray-600 mb-2">Current Video:</p>
								<a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">{value}</a>
							</div>
						) : null
					)}
				/>
				
				{/* New Video Upload */}
				<Controller
					control={control}
					name={`lessons.${lessonIndex}.video`}
					render={({field: {onChange, value}, fieldState: {error}}) => (
						<div>
							<Label className="text-sm text-gray-600">{isExistingLesson ? "Replace Video (Optional)" : "Upload Video *"}</Label>
							<Input
								type="file"
								accept="video/*"
								onChange={(e) => onChange(e.target.files?.[0] ?? null)}
								className={error ? "border-red-500" : ""}
							/>
							{value && value.name && (
								<p className="text-sm text-green-600 mt-1">Selected: {value.name}</p>
							)}
							{error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
						</div>
					)}
				/>
			</div>
			
			<div className="flex flex-col gap-4">
				<Controller
					control={control}
					name={`lessons.${lessonIndex}.is_preview`}
					render={({field}) => (
						<div className="flex items-center gap-2">
							<Switch checked={field.value} onCheckedChange={field.onChange} />
							<Label>Preview Lesson (Free access)</Label>
						</div>
					)}
				/>
				
				<Controller
					control={control}
					name={`lessons.${lessonIndex}.is_published`}
					render={({field}) => (
						<div className="flex items-center gap-2">
							<Switch checked={field.value} onCheckedChange={field.onChange} />
							<Label>Published</Label>
						</div>
					)}
				/>
			</div>
		</CardContent>
	</Card>
);

export default function CreateCourse() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const {id} = useParams();
	
	const {categories} = useSelector(state => state.category);
	const {teachers} = useSelector(state => state.admin);
	const {course} = useSelector(state => state.course);
	
	const [isLoading, setIsLoading] = useState(false);
	const [serverError, setServerError] = useState("");
	
	const {
		register,
		control,
		handleSubmit,
		formState: {errors},
		reset,
	} = useForm({
		resolver: zodResolver(courseSchema),
		defaultValues: {
			title: "",
			description: "",
			price_cents: 0,
			currency: "usd",
			published: false,
			preview: null,
			teacher: "",
			category: "",
			lessons: [{title: "", content: "", link: "", video: null, order_index: 1}],
		}
	});
	
	const {fields: lessons, append: appendLesson, remove: removeLesson} = useFieldArray({
		control,
		name: "lessons",
	});
	
	useEffect(() => {
		dispatch(getCategories());
		dispatch(getTeachers());
	}, [dispatch]);
	
	useEffect(() => {
		if (id) {
			dispatch(getCourseById({id})).then(({payload}) => {
				if (payload) {
					reset({
						title: payload?.title ?? "",
						description: payload?.description ?? "",
						price_cents: payload?.price_cents ?? 0,
						currency: payload?.currency ?? "usd",
						published: payload?.published ?? false,
						teacher: payload?.teacher?.id?.toString() ?? "",
						category: payload?.category?.id?.toString() ?? "",
						lessons: payload?.lessons?.map((lesson) => ({
							id: lesson.id,
							title: lesson.title,
							content: lesson.content || "",
							video_url: lesson.video_url || "",
							link: lesson.link || "",
							is_preview: lesson.is_preview || false,
							is_published: lesson.is_published || false,
							video: null,
							order_index: lesson.order_index || 1,
						})) || [],
						preview: payload?.preview_image ? payload.preview_image : null,
					});
				}
			});
		}
	}, [dispatch, id, reset]);
	
	const onSubmit = async (data) => {
		setIsLoading(true);
		setServerError("");
		
		try {
			const formData = new FormData();
			formData.append("title", data.title);
			formData.append("description", data.description);
			formData.append("price_cents", String(data.price_cents ?? 0));
			formData.append("currency", data.currency);
			formData.append("published", String(data.published));
			formData.append("category", data.category);
			formData.append("teacher", data.teacher);
			
			if (data.preview && data.preview instanceof File) {
				formData.append("preview", data.preview);
			}
			
			const lessonsJSON = data.lessons.map((l, idx) => ({
				id: l.id || null,
				title: l.title,
				content: l.content,
				link: l.link || "",
				order_index: idx + 1,
				is_preview: l.is_preview || false,
				is_published: l.is_published || false,
				video_url: l.video_url || null,
			}));
			
			formData.append("lessons", JSON.stringify(lessonsJSON));
			
			// append video files (if user uploaded new ones)
			data.lessons.forEach((l, index) => {
				if (l.video && l.video instanceof File) {
					// backend expects multiple videos under same field name 'lessonsVideo' — adjust if backend needs keys like lessonsVideo[<index>]
					formData.append("lessonsVideo", l.video);
				}
			});
			
			const url = id ? `/courses/full/${id}` : "/courses/full";
			const method = id ? "put" : "post";
			
			const response = await instance({
				method,
				url,
				data: formData,
				headers: {"Content-Type": "multipart/form-data"},
			});
			
			if (response.status === (id ? 200 : 201)) {
				toast.success(`Course \"${data.title}\" ${id ? "updated" : "created"} successfully!`);
				navigate("/admin/courses");
			}
		} catch (error) {
			setServerError(error.response?.data?.error || error.message || "An error occurred");
		} finally {
			setIsLoading(false);
		}
	};
	
	return (
		<div className="container mx-auto py-3 px-4 max-w-4xl">
			<h1 className="text-3xl font-bold mb-6">{id ? "Update" : "Create"} Course</h1>
			
			{serverError && (
				<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
					<strong>Error:</strong> {serverError}
				</div>
			)}
			
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
				{/* Course info */}
				<Card>
					<CardHeader>
						<CardTitle>Course Information</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex flex-col gap-1">
							<Label>Course Title *</Label>
							<Input {...register("title")} placeholder="Enter title" className={errors.title ? "border-red-500" : ""} />
							{errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
						</div>
						
						<div className="flex flex-col gap-1">
							<Label>Description *</Label>
							<Textarea {...register("description")} placeholder="Course description" rows={3} />
						</div>
						
						{/* Category & Teacher */}
						<div className="grid grid-cols-2 gap-4">
							<div className="flex flex-col gap-1">
								<Label htmlFor="course-category">Category</Label>
								<Controller
									name="category"
									control={control}
									render={({field}) => (
										<Select value={field.value} onValueChange={field.onChange}>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Select a category" />
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													<SelectLabel>Categories</SelectLabel>
													{categories?.map((item) => (
														<SelectItem key={item.id} value={item.id.toString()}>{item.name}</SelectItem>
													))}
												</SelectGroup>
											</SelectContent>
										</Select>
									)}
								/>
								{errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
							</div>
							
							{getUserData().role === "admin" && (
								<div className="flex flex-col gap-1">
									<Label htmlFor="course-teacher">Teacher</Label>
									<Controller
										name="teacher"
										control={control}
										render={({field}) => (
											<Select value={field.value} onValueChange={field.onChange}>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Select a teacher" />
												</SelectTrigger>
												<SelectContent>
													<SelectGroup>
														<SelectLabel>Teachers</SelectLabel>
														{teachers?.map((item) => (
															<SelectItem key={item?.id} value={item?.id?.toString()}>{item?.name}</SelectItem>
														))}
													</SelectGroup>
												</SelectContent>
											</Select>
										)}
									/>
									{errors.teacher && <p className="text-red-500 text-sm">{errors.teacher.message}</p>}
								</div>
							)}
						</div>
						
						{/* Price, currency, published */}
						<div className="grid grid-cols-2 gap-4">
							<Input type="number" {...register("price_cents", {valueAsNumber: true})} placeholder="Price (cents)" />
							<Input {...register("currency")} readOnly />
						</div>
						
						<div className="flex flex-col gap-2">
							<Label>Publication Status</Label>
							<Controller
								name="published"
								control={control}
								render={({field}) => (
									<div className="flex items-center gap-3 p-2 border rounded-lg">
										<Switch checked={field.value} onCheckedChange={field.onChange} />
										<div>
											<Label className="font-medium">{field.value ? "Published" : "Draft"}</Label>
											<p className="text-sm text-gray-500">{field.value ? "Course is visible to students" : "Course is hidden"}</p>
										</div>
									</div>
								)}
							/>
						</div>
						
						{/* Preview */}
						<Controller
							name="preview"
							control={control}
							render={({field: {onChange, value}}) => (
								<div>
									<Label>Preview Image</Label>
									<Input type="file" accept="image/*" onChange={(e) => onChange(e.target.files?.[0] ?? null)} />
									
									{course?.preview_image && !value && (
										<div className="mt-2">
											<p className="text-sm text-gray-600 mb-1">Current Image:</p>
											<img src={instance.defaults.baseURL + course?.preview_image} alt="Current preview" className="h-56 w-56 object-cover rounded-md" />
										</div>
									)}
								</div>
							)}
						/>
					</CardContent>
				</Card>
				
				{/* Lessons */}
				<Card>
					<CardHeader><CardTitle>Lessons</CardTitle></CardHeader>
					<CardContent className="space-y-6">
						{lessons.map((lesson, i) => (
							<LessonSection
								key={lesson.id || i}
								control={control}
								register={register}
								lessonIndex={i}
								removeLesson={removeLesson}
								errors={errors}
								isExistingLesson={!!lesson.id}
							/>
						))}
						<Button
							type="button"
							onClick={() => appendLesson({title: "", content: "", link: "", video: null, order_index: lessons.length + 1})}
						>
							Add Lesson
						</Button>
					</CardContent>
				</Card>
				
				{/* Submit */}
				<div className="flex justify-end pt-6 border-t space-x-4">
					<Button type="button" variant="outline" onClick={() => reset()} disabled={isLoading}>Reset</Button>
					<Button type="submit" disabled={isLoading}>{id ? "Update" : "Create"} Course</Button>
				</div>
			</form>
		</div>
	);
}

