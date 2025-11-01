import React, {useState} from 'react';
import Dropzone from "@/components/Dropzone.jsx";

import {Button} from "@/components/ui/button";
import {ImageIcon, Pencil, PlusCircle} from "lucide-react";
import instance from "@/utils/axios.js";
import {useDispatch} from "react-redux";
import {updateCourse} from "@/features/course/courseSlice.js";
import toast from "react-hot-toast";

const ImageForm = ({initialData, courseId}) => {
	const dispatch = useDispatch()
	const [file, setFile] = useState(null);
	
	const [isEditing, setIsEditing] = useState(false)
	
	const toggleEdit = () => setIsEditing((current) => !current)
	
	const onSubmit = () => {
		const formData = new FormData()
		formData.append("preview_image", file)
		
		dispatch(updateCourse({id: courseId, formData})).then(({payload}) => {
			if (payload) {
				toast.success("Course updated")
				toggleEdit()
			}
		})
	}
	
	return (
		<div className="mt-6 border bg-slate-100 rounded-md p-4">
			<div className="font-medium flex items-center justify-between">
				Course image
				<Button onClick={toggleEdit} variant="ghost">
					{isEditing && (
						<>Cancel</>
					)}
					{!isEditing && !initialData?.preview_image && (
						<>
							<PlusCircle className="w-4 h-4 mr-2"/>
							Add an image
						</>
					)}
					{!isEditing && initialData?.preview_image && (
						<>
							<Pencil className="w-4 h-4 mr-2"/>
							Edit image
						</>
					)}
				</Button>
			</div>
			{!isEditing && (
				!initialData?.preview_image ? (
					<div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
						<ImageIcon className="w-10 h-10 text-slate-500"/>
					</div>
				) : (
					<div className="relative aspect-video mt-2">
						<img
							src={instance.defaults.baseURL + initialData?.preview_image}
							alt="Upload"
							className="object-cover rounded-md max-h-[300px]"
						/>
					</div>
				)
			)}
			{isEditing && (
				<div>
					<Dropzone
						onFileSelect={setFile}
						label="Kurs rasmini yuklang yoki tashlang"
						accept={{
							"image/*": [],
						}}
						onSubmit={onSubmit}
					/>
					<div className="text-xs text-muted-foreground mt-4">
						16:9 aspect ratio recommended
					</div>
				</div>
			)}
		</div>
	);
};

export default ImageForm;