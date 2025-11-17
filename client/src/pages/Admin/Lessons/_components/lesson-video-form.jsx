import React, {useState} from 'react';
import Dropzone from "@/components/Dropzone.jsx";

import {Button} from "@/components/ui/button";
import {Pencil, PlusCircle, Video} from "lucide-react";
import {useDispatch} from "react-redux";
import toast from "react-hot-toast";
import {updateLesson} from "@/features/course/lessonSlice.js";
import {z} from "zod";
import VideoPlayer from "@/components/VideoPlayer.jsx";
import instance from "@/utils/axios.js";

const formSchema = z.object({
	video_url: z.string().min(1)
})

const LessonVideoForm = ({initialData, lessonId}) => {
	const dispatch = useDispatch()
	const [file, setFile] = useState(null);
	
	const [isEditing, setIsEditing] = useState(false)
	
	const toggleEdit = () => setIsEditing((current) => !current)
	
	const onSubmit = () => {
		const formData = new FormData()
		formData.append("lessonsVideo", file)
		
		dispatch(updateLesson({id: lessonId, data: formData})).then(({payload}) => {
			if (payload?.id) {
				toast.success("Lesson updated")
				toggleEdit()
			}
		})
	}
	
	return (
		<div className="mt-6 border bg-slate-100 rounded-md p-4">
			<div className="font-medium flex items-center justify-between">
				Lesson video *
				<Button onClick={toggleEdit} variant="ghost">
					{isEditing && (
						<>Cancel</>
					)}
					{!isEditing && !initialData?.video_url && (
						<>
							<PlusCircle className="w-4 h-4 mr-2"/>
							Add an video
						</>
					)}
					{!isEditing && initialData?.video_url && (
						<>
							<Pencil className="w-4 h-4 mr-2"/>
							Edit video
						</>
					)}
				</Button>
			</div>
			{!isEditing && (
				!initialData?.video_url ? (
					<div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
						<Video className="w-10 h-10 text-slate-500"/>
					</div>
				) : (
					<div className="relative aspect-video mt-2">
						<VideoPlayer url={instance.defaults.baseURL + initialData?.video_url} />
					</div>
				)
			)}
			{isEditing && (
				<div>
					<Dropzone
						onFileSelect={setFile}
						label="Lesson video"
						accept={{
							"video/*": [],
						}}
						onSubmit={onSubmit}
					/>
					<div className="text-xs text-muted-foreground mt-4">
						Upload this lesson video
					</div>
				</div>
			)}
			
			{initialData?.video_url && !isEditing && (
				<div className="text-xs text-muted-foreground mt-2">
					Videos can take a few minutes to process. Refresh the page if video does not appear.
				</div>
			)}
		</div>
	);
};

export default LessonVideoForm;