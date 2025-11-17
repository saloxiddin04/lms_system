import {useEffect, useState} from "react";
import * as z from "zod"
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage
} from "@/components/ui/form";

import {Button} from "@/components/ui/button";
import {Pencil} from "lucide-react";
import toast from "react-hot-toast";
import {cn} from "@/lib/utils";
import {useDispatch} from "react-redux";
import {updateLesson} from "@/features/course/lessonSlice.js";
import Editor from "@/components/Editor.jsx";
import Preview from "@/components/Preview.jsx";

const formSchema = z.object({
	content: z.string().min(1, {message: "Content is required!"})
})

const LessonContentForm = ({initialData, lessonId}) => {
	const dispatch = useDispatch()
	
	const [isEditing, setIsEditing] = useState(false)
	
	const toggleEdit = () => setIsEditing((current) => !current)
	
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: initialData
	})
	
	const {isSubmitting, isValid} = form.formState
	
	useEffect(() => {
		form.reset(initialData);
	}, [initialData, form]);
	
	const onSubmit = async (data) => {
		await dispatch(updateLesson({id: lessonId, data})).then(({payload}) => {
			if (payload) {
				toast.success("Lesson updated")
				toggleEdit()
			}
		})
	}
	
	return (
		<div className="mt-6 border bg-slate-100 rounded-md p-4">
			<div className="font-medium flex items-center justify-between">
				Lesson content *
				<Button onClick={toggleEdit} variant="ghost">
					{isEditing ? (
						<>Cancel</>
					) : (
						<>
							<Pencil className="w-4 h-4 mr-2"/>
							Edit content
						</>
					)}
				</Button>
			</div>
			{!isEditing && (
				<div
					className={cn(
						"text-sm mt-2",
						!initialData?.content && "text-slate-500 italic"
					)}
				>
					{!initialData?.content && "No description"}
					{initialData?.content && (
						<Preview value={initialData?.content} />
					)}
				</div>
			)}
			{isEditing && (
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4 mt-4"
					>
						<FormField
							control={form.control}
							name="content"
							render={({field}) => (
								<FormItem>
									<FormControl>
										<Editor
											{...field}
										/>
									</FormControl>
									<FormMessage/>
								</FormItem>
							)}
						/>
						<div className="flex items-center gap-x-2">
							<Button
								disabled={!isValid || isSubmitting}
								type="submit"
							>
								Save
							</Button>
						</div>
					</form>
				</Form>
			)}
		</div>
	);
};

export default LessonContentForm;