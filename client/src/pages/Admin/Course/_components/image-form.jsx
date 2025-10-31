import React, {useState} from 'react';
import * as z from "zod"
import axios from "axios";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";

import Dropzone from "@/components/Dropzone.jsx";


import {Button} from "@/components/ui/button";
import {ImageIcon, Pencil, PlusCircle} from "lucide-react";

const formSchema = z.object({
	preview_image: z.string().min(1, {message: "Image is required!"})
})

const ImageForm = ({initialData, courseId}) => {
	const [file, setFile] = useState(null);
	
	const [isEditing, setIsEditing] = useState(false)
	
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			preview_image: initialData?.preview_image || ""
		}
	})
	
	return (
		<div>
			<Dropzone onFileSelect={setFile} label="Kurs rasmini yuklang yoki tashlang" />
		</div>
	);
};

export default ImageForm;