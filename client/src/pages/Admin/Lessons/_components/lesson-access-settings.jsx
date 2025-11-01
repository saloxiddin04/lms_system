import React from 'react';
import {useEffect, useState} from "react";
import * as z from "zod"
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";

import {
	Form,
	FormControl, FormDescription,
	FormField,
	FormItem,
	FormMessage
} from "@/components/ui/form";
import {useDispatch} from "react-redux";
import {updateLesson} from "@/features/course/lessonSlice.js";
import toast from "react-hot-toast";
import {Button} from "@/components/ui/button.jsx";
import {Pencil} from "lucide-react";
import {cn} from "@/lib/utils.js";
import Preview from "@/components/Preview.jsx";
import Editor from "@/components/Editor.jsx";
import {Switch} from "@/components/ui/switch.jsx";

const formSchema = z.object({
	is_preview: z.boolean().default(false)
})

const LessonAccessSettings = ({initialData, lessonId}) => {
	
	const dispatch = useDispatch()
	
	const [isEditing, setIsEditing] = useState(false)
	
	const toggleEdit = () => setIsEditing((current) => !current)
	
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			is_preview: !!initialData?.is_preview
		}
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
				Lesson access
				<Button onClick={toggleEdit} variant="ghost">
					{isEditing ? (
						<>Cancel</>
					) : (
						<>
							<Pencil className="w-4 h-4 mr-2"/>
							Edit access
						</>
					)}
				</Button>
			</div>
			{!isEditing && (
				<p
					className={cn(
						"text-sm mt-2",
						!initialData?.is_preview && "text-slate-500 italic"
					)}
				>
					{initialData?.is_preview ? (
						<>This lesson is free for preview.</>
					) : (
						<>This lesson is not free.</>
					)}
				</p>
			)}
			{isEditing && (
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4 mt-4"
					>
						<FormField
							control={form.control}
							name="is_preview"
							render={({field}) => (
								<FormItem className={"flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"}>
									<FormControl>
										<Switch checked={field.value} onCheckedChange={field.onChange}/>
									</FormControl>
									<div className="space-y-1 leading-none">
										<FormDescription>
											Check this box if you want to make this lesson free for preview
										</FormDescription>
									</div>
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

export default LessonAccessSettings;