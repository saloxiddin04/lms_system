import React, {useState} from 'react';
import {Controller, useFieldArray, useForm} from "react-hook-form";
import {Button} from "@/components/ui/button.jsx";
import {Card, CardContent} from "@/components/ui/card.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Textarea} from "@/components/ui/textarea.jsx";
import {Switch} from "@/components/ui/switch.jsx";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import instance from "@/utils/axios.js";
import {useNavigate, useParams} from "react-router-dom";
import toast from "react-hot-toast";

const lessonSchema = z.object({
	title: z.string().min(1, "Lesson title is required"),
	content: z.string().optional(),
	link: z.string().optional().or(z.literal("")),
	video: z.any().refine((file) => file && file.length > 0, "Video file is required"),
	order_index: z.number().optional(),
	video_url: z.any().optional(),
	is_preview: z.boolean().optional().default(false),
	is_published: z.boolean().optional().default(true),
});

const CreateLessons = () => {
	const navigate = useNavigate()
	const {courseId} = useParams()
	
	const [isLoading, setIsLoading] = useState(false);
	const [serverError, setServerError] = useState("");
	
	const {register, control, handleSubmit, reset, formState: {errors}} = useForm({
		resolver: zodResolver(z.object({lessons: z.array(lessonSchema)})),
		defaultValues: {
			lessons: [
				{title: "", content: "", link: "", order_index: 1, is_preview: false, is_published: true, video_url: null},
			],
		},
	});
	
	const {fields, append, remove} = useFieldArray({
		control,
		name: "lessons",
	});
	
	const onSubmit = async (data) => {
		setIsLoading(true);
		setServerError("");
		
		try {
			const formData = new FormData();
			
			const lessonsJSON = data?.lessons?.map((l, index) => ({
				id: l.id || null,
				title: l.title,
				content: l.content,
				link: l.link || "",
				order_index: index + 1,
				is_preview: l.is_preview || false,
				is_published: l.is_published || false,
			}));
			
			formData.append("lessons", JSON.stringify(lessonsJSON));
			
			data?.lessons?.forEach((l) => {
				if (l.video && l.video[0] instanceof File) {
					formData.append("lessonsVideo", l.video[0]);
				}
			});
			
			const response = await instance.post(`/lessons/${courseId}/lessons`, formData, {headers: {"Content-Type": "multipart/form-data"}})
			if (response.status === (201)) {
				toast.success(`Course ${courseId ? "updated" : "created"} successfully!`);
				navigate("/admin/lessons");
				reset()
			}
		} catch (error) {
			setServerError(error.response?.data?.error || error.message || "An error occurred");
		} finally {
			setIsLoading(false);
			reset()
		}
	}
	
	return (
		<Card className="max-w-3xl mx-auto mt-6">
			<CardContent className="space-y-6">
				<h2 className="text-xl font-semibold">Upload Lessons</h2>
				
				{serverError && (
					<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
						<strong>Error:</strong> {serverError}
					</div>
				)}
				
				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleSubmit(onSubmit)(e);
					}}
					className="space-y-6"
				>
					{fields.map((field, index) => (
						<div
							key={field.id}
							className="p-4 border rounded-lg space-y-3 bg-gray-50"
						>
							{/* Title */}
							<div className="space-y-1">
								<Label>Lesson Title</Label>
								<Input
									{...register(`lessons.${index}.title`)}
									placeholder="Enter lesson title"
								/>
								{errors.lessons?.[index]?.title && (
									<p className="text-red-500 text-sm">
										{errors.lessons[index].title.message}
									</p>
								)}
							</div>
							
							{/* Content */}
							<div className="space-y-1">
								<Label>Content</Label>
								<Textarea
									{...register(`lessons.${index}.content`)}
									placeholder="Lesson description"
								/>
								{errors.lessons?.[index]?.content && (
									<p className="text-red-500 text-sm">
										{errors.lessons[index].content.message}
									</p>
								)}
							</div>
							
							{/* Link */}
							<div className="space-y-1">
								<Label>External Link</Label>
								<Input
									{...register(`lessons.${index}.link`)}
									placeholder="https://example.com"
								/>
								{errors.lessons?.[index]?.link && (
									<p className="text-red-500 text-sm">
										{errors.lessons[index].link.message}
									</p>
								)}
							</div>
							
							{/* Order */}
							<div className="space-y-1">
								<Label>Order</Label>
								<Input
									type="number"
									{...register(`lessons.${index}.order_index`)}
									defaultValue={index + 1}
									disabled
								/>
								{errors.lessons?.[index]?.order_index && (
									<p className="text-red-500 text-sm">
										{errors.lessons[index].order_index.message}
									</p>
								)}
							</div>
							
							{/*<div className="flex items-center space-x-2">*/}
							{/*	<Checkbox*/}
							{/*		id={`preview-${index}`}*/}
							{/*		{...register(`lessons.${index}.is_preview`)}*/}
							{/*	/>*/}
							{/*	<Label htmlFor={`preview-${index}`}>Is Preview?</Label>*/}
							{/*</div>*/}
							
							<div className="flex flex-col gap-4">
								<Controller
									control={control}
									name={`lessons.${index}.is_preview`}
									render={({field}) => (
										<div className="flex items-center gap-2">
											<Switch checked={field.value} onCheckedChange={field.onChange}/>
											<Label>Preview Lesson (Free access)</Label>
										</div>
									)}
								/>
								
								<Controller
									control={control}
									name={`lessons.${index}.is_published`}
									render={({field}) => (
										<div className="flex items-center gap-2">
											<Switch checked={field.value} onCheckedChange={field.onChange}/>
											<Label>Published</Label>
										</div>
									)}
								/>
							</div>
							
							{/* Video */}
							<div className="space-y-1">
								<Label>Video File</Label>
								<Input
									type="file"
									accept="video/*"
									{...register(`lessons.${index}.video`)}
								/>
								{errors.lessons?.[index]?.video && (
									<p className="text-red-500 text-sm">
										{errors.lessons[index].video.message}
									</p>
								)}
							</div>
							
							<div className="flex justify-between">
								<Button
									type="button"
									variant="destructive"
									onClick={() => remove(index)}
								>
									Remove
								</Button>
							</div>
						</div>
					))}
					
					{/* Add Lesson */}
					<Button
						type="button"
						variant="secondary"
						onClick={() =>
							append({
								title: "",
								content: "",
								link: "",
								order_index: fields.length + 1,
								is_preview: false,
								is_published: true,
								video_url: null,
							})
						}
					>
						+ Add Lesson
					</Button>
					
					{/* Submit */}
					<Button type="submit" className="w-full">
						{isLoading ? "Uploading..." : "Upload All Lessons"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
};

export default CreateLessons;