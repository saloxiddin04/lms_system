import React, {useState} from 'react';
import {Controller, useFieldArray, useForm} from "react-hook-form";
import {Button} from "@/components/ui/button.jsx";
import {Card, CardContent} from "@/components/ui/card.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Textarea} from "@/components/ui/textarea.jsx";
import {Switch} from "@/components/ui/switch.jsx";

const CreateLessons = () => {
	const { register, control, handleSubmit, reset } = useForm({
		defaultValues: {
			lessons: [
				{ title: "", content: "", link: "", order_index: 1, is_preview: false, video_url: null },
			],
		},
	});
	
	const { fields, append, remove } = useFieldArray({
		control,
		name: "lessons",
	});
	
	const [videos, setVideos] = useState([]);
	
	const onSubmit = async (data) => {
		const formData = new FormData();
		
		// `lessons` ni klon qilamiz, chunki ichidan fayllarni olib tashlash kerak
		const lessonsWithoutFiles = data.lessons.map((l) => {
			const { video_url, ...rest } = l;
			return rest;
		});
		
		// lessons JSON sifatida
		formData.append("lessons", JSON.stringify(lessonsWithoutFiles));
		
		// Fayllarni qo'shamiz (har bir lesson uchun bitta file)
		data.lessons.forEach((lesson) => {
			if (lesson.video_url && lesson.video_url[0]) {
				formData.append("videos", lesson.video_url[0]);
			} else {
				formData.append("videos", ""); // bo‘sh bo‘lsa ham index saqlanadi
			}
		});
	}
	
	return (
		<Card className="max-w-3xl mx-auto mt-6">
			<CardContent className="space-y-6">
				<h2 className="text-xl font-semibold">Upload Lessons</h2>
				
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
							</div>
							
							{/* Content */}
							<div className="space-y-1">
								<Label>Content</Label>
								<Textarea
									{...register(`lessons.${index}.content`)}
									placeholder="Lesson description"
								/>
							</div>
							
							{/* Link */}
							<div className="space-y-1">
								<Label>External Link</Label>
								<Input
									{...register(`lessons.${index}.link`)}
									placeholder="https://example.com"
								/>
							</div>
							
							{/* Order */}
							<div className="space-y-1">
								<Label>Order</Label>
								<Input
									type="number"
									{...register(`lessons.${index}.order_index`)}
									defaultValue={index + 1}
								/>
							</div>
							
							{/*<div className="flex items-center space-x-2">*/}
							{/*	<Checkbox*/}
							{/*		id={`preview-${index}`}*/}
							{/*		{...register(`lessons.${index}.is_preview`)}*/}
							{/*	/>*/}
							{/*	<Label htmlFor={`preview-${index}`}>Is Preview?</Label>*/}
							{/*</div>*/}
							
							<Controller
								name="published"
								control={control}
								defaultValue={false}
								render={({field}) => (
									<div className="flex items-center gap-2">
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
										<Label>Is preview</Label>
									</div>
								)}
							/>
							
							{/* Video */}
							<div className="space-y-1">
								<Label>Video File</Label>
								<Input
									type="file"
									accept="video/*"
									{...register(`lessons.${index}.video_url`)}
								/>
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
								video_url: null,
							})
						}
					>
						+ Add Lesson
					</Button>
					
					{/* Submit */}
					<Button type="submit" className="w-full">
						Upload All Lessons
					</Button>
				</form>
			</CardContent>
		</Card>
	);
};

export default CreateLessons;