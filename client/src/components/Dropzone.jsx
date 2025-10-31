import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {Upload, UploadCloudIcon, X} from "lucide-react";

export default function Dropzone({ onFileSelect, label = "Faylni tashlang yoki tanlang", onSubmit, accept }) {
	const [file, setFile] = useState(null);
	
	const onDrop = useCallback((acceptedFiles) => {
		const selected = acceptedFiles[0];
		if (selected) {
			setFile(selected);
			onFileSelect(selected);
		}
	}, [onFileSelect]);
	
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		multiple: false,
		accept
	});
	
	const removeFile = () => {
		setFile(null);
		onFileSelect(null);
	};
	
	return (
		<Card
			{...getRootProps()}
			className={`border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
				isDragActive ? "border-primary bg-primary/10" : "border-muted hover:bg-muted/40"
			}`}
		>
			<CardContent className="flex flex-col items-center justify-center py-8 text-center space-y-3">
				<input {...getInputProps()} />
				{!file ? (
					<>
						<Upload className="w-10 h-10 text-muted-foreground" />
						<p className="text-sm text-muted-foreground">{label}</p>
						<Button type="button" variant="outline" className="mt-2">
							Choose file
						</Button>
					</>
				) : (
					<div className="flex flex-col items-center gap-2">
						<p className="text-sm font-medium">{file.name}</p>
						<Button
							variant="destructive"
							size="sm"
							onClick={(e) => {
								e.stopPropagation()
								removeFile()
							}}
						>
							<X className="w-4 h-4 mr-1" /> Remove
						</Button>
						<Button
							onClick={(e) => {
								e.stopPropagation()
								onSubmit()
							}}
						>
							<UploadCloudIcon className="w-4 h-4 mr-1" /> Upload
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
