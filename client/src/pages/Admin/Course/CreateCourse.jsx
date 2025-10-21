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
import {useNavigate} from "react-router-dom";
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

// Validation schema
const lessonSchema = z.object({
	title: z.string().min(1, "Lesson title is required"),
	content: z.string().optional(),
	link: z.string().url("Must be a valid URL").optional().or(z.literal("")),
	video: z.any()
		.refine((file) => file instanceof File && file.size > 0, "Video file is required")
		.refine((file) => {
			if (!(file instanceof File)) return false;
			const allowedTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/webm', 'video/mkv'];
			return allowedTypes.includes(file.type);
		}, "Only video files are allowed (MP4, MOV, AVI, WEBM, MKV)")
		.refine((file) => file.size <= 100 * 1024 * 1024, "File size must be less than 100MB"),
	order_index: z.number(),
});

const courseSchema = z.object({
	title: z.string().min(1, "Course title is required"),
	description: z.string().min(1, "Description is required"),
	price_cents: z.number().min(0, "Price must be positive"),
	currency: z.string().min(1, "Currency is required"),
	lessons: z.array(lessonSchema).min(1, "At least one lesson is required"),
	published: z.boolean().default(false),
	preview: z.any().optional(),
	category: z.string().min(1, "Category is required"),
	teacher: z.string().min(1, "Teacher is required"),
});

const LessonSection = ({control, register, lessonIndex, removeLesson, errors}) => (
	<Card className="border border-gray-200 p-4 bg-white mb-4">
		<CardHeader className="flex flex-row justify-between items-center p-0 pb-4">
			<CardTitle className="text-lg">Lesson {lessonIndex + 1}</CardTitle>
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
			<div className="flex flex-col gap-1">
				<Label>Video File</Label>
				<Controller
					control={control}
					name={`lessons.${lessonIndex}.video`}
					render={({field: {onChange, value}, fieldState: {error}}) => (
						<div>
							<Input
								type="file"
								accept="video/*"
								onChange={(e) => onChange(e.target.files[0])}
								className={error ? "border-red-500" : ""}
							/>
							{value && <p className="text-sm text-green-600 mt-1">Selected: {value.name}</p>}
							{error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
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
	const {categories} = useSelector(state => state.category);
	const {teachers} = useSelector(state => state.admin);
	
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
		name: "lessons"
	});
	
	useEffect(() => {
		dispatch(getCategories());
		dispatch(getTeachers());
	}, [dispatch]);
	
	const onSubmit = async (data) => {
		setIsLoading(true);
		setServerError("");
		
		try {
			const formData = new FormData();
			formData.append("title", data.title);
			formData.append("description", data.description);
			formData.append("price_cents", data.price_cents.toString());
			formData.append("currency", data.currency);
			formData.append("published", data.published.toString());
			formData.append("category_id", data.category);
			formData.append("teacher_id", data.teacher);
			
			if (data.preview && data.preview instanceof File) formData.append("preview", data.preview);
			
			const lessonsJSON = data.lessons.map((l, idx) => ({
				title: l.title,
				content: l.content,
				link: l.link,
				order_index: idx + 1,
			}));
			formData.append("lessons", JSON.stringify(lessonsJSON));
			data.lessons.forEach(l => {
				if (l.video instanceof File) formData.append("lessonsVideo", l.video);
			});
			
			const response = await instance.post("/courses/full", formData)
			
			if (response.status === 201) {
				toast.success(`Course "${data.title}" created successfully!`);
				navigate("/admin/courses");
			}
		} catch (error) {
			setServerError(error.response?.data?.error || error.message);
		} finally {
			setIsLoading(false);
		}
	};
	
	return (
		<div className="container mx-auto py-3 px-4 max-w-4xl">
			<h1 className="text-3xl font-bold mb-6">Create Course</h1>
			
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
							<Input {...register("title")} placeholder="Enter title" className={errors.title ? "border-red-500" : ""}/>
						</div>
						
						<div className="flex flex-col gap-1">
							<Label>Description *</Label>
							<Textarea {...register("description")} placeholder="Course description" rows={3}/>
						</div>
						
						{/* Category & Teacher */}
						<div className="grid grid-cols-2 gap-4">
							<Controller
								name="category"
								control={control}
								render={({field}) => (
									<div>
										<Label>Category</Label>
										<Select value={field.value} onValueChange={field.onChange}>
											<SelectTrigger><SelectValue placeholder="Select category"/></SelectTrigger>
											<SelectContent>
												<SelectGroup>
													<SelectLabel>Categories</SelectLabel>
													{categories?.map(cat => (
														<SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
													))}
												</SelectGroup>
											</SelectContent>
										</Select>
									</div>
								)}
							/>
							
							<Controller
								name="teacher"
								control={control}
								render={({field}) => (
									<div>
										<Label>Teacher</Label>
										<Select value={field.value} onValueChange={field.onChange}>
											<SelectTrigger><SelectValue placeholder="Select teacher"/></SelectTrigger>
											<SelectContent>
												<SelectGroup>
													<SelectLabel>Teachers</SelectLabel>
													{teachers?.map(t => (
														<SelectItem key={t.id} value={t.id.toString()}>{t.name}</SelectItem>
													))}
												</SelectGroup>
											</SelectContent>
										</Select>
									</div>
								)}
							/>
						</div>
						
						{/* Price, currency, published */}
						<div className="grid grid-cols-2 gap-4">
							<Input type="number" {...register("price_cents", {valueAsNumber: true})} placeholder="Price (cents)"/>
							<Input {...register("currency")} readOnly/>
						</div>
						
						<Controller
							name="published"
							control={control}
							render={({field}) => (
								<div className="flex items-center gap-2">
									<Switch checked={field.value} onCheckedChange={field.onChange}/>
									<Label>Published</Label>
								</div>
							)}
						/>
						
						{/* Preview */}
						<Controller
							name="preview"
							control={control}
							render={({field: {onChange}}) => (
								<div>
									<Label>Preview Image</Label>
									<Input type="file" accept="image/*" onChange={(e) => onChange(e.target.files[0])}/>
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
								key={lesson.id}
								control={control}
								register={register}
								lessonIndex={i}
								removeLesson={removeLesson}
								errors={errors}
							/>
						))}
						<Button
							type="button"
							onClick={() =>
								appendLesson({title: "", content: "", link: "", video: null, order_index: lessons.length + 1})
							}
						>
							Add Lesson
						</Button>
					</CardContent>
				</Card>
				
				{/* Submit */}
				<div className="flex justify-end pt-6 border-t space-x-4">
					<Button type="button" variant="outline" onClick={() => reset()} disabled={isLoading}>Reset</Button>
					<Button type="submit" disabled={isLoading}>
						Create Course
					</Button>
				</div>
			</form>
		</div>
	);
}
