
import {useState} from "react";
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
import {Loader2, PlusCircle} from "lucide-react";
import toast from "react-hot-toast";
import {cn} from "@/lib/utils";
import {useDispatch} from "react-redux";
import {createLesson, reorderLesson} from "@/features/course/lessonSlice.js";
import {Input} from "@/components/ui/input.jsx";
import LessonsList from "@/pages/Admin/Course/_components/lessons-list.jsx";
import {useNavigate} from "react-router-dom";


const formSchema = z.object({
	title: z.string().min(1, {message: "Description is required!"})
})

const LessonsForm = ({initialData, courseId}) => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	
	const [isUpdating, setIsUpdating] = useState(false)
	const [isCreating, setIsCreating] = useState(false)
	
	const toggleCreating = () => setIsCreating((current) => !current)
	
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: ""
		}
	})
	
	const {isSubmitting, isValid} = form.formState
	
	const onSubmit = async (data) => {
		await dispatch(createLesson({courseId, formData: data})).then(({payload}) => {
			if (payload) {
				toast.success("Lesson created")
				toggleCreating()
			}
		})
	}
	
	const onReorder = (updateData) => {
		try {
			setIsUpdating(true)
			dispatch(reorderLesson({courseId, formData: updateData})).then(({payload}) => {
				if (payload) {
					setIsUpdating(false)
					toast.success("Lesson reordered")
				}
			})
		} catch (e) {
			setIsUpdating(false)
		} finally {
			setIsUpdating(false)
		}
	}
	
	return (
		<div className="relative mt-6 border bg-slate-100 rounded-md p-4">
			{isUpdating && (
				<div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-md flex items-center justify-center">
					<Loader2 className="animate-spin w-6 h-6 text-sky-700" />
				</div>
			)}
			<div className="font-medium flex items-center justify-between">
				Course lessons
				<Button onClick={toggleCreating} variant="ghost">
					{isCreating ? (
						<>Cancel</>
					) : (
						<>
							<PlusCircle className="w-4 h-4 mr-2"/>
							Add a lesson
						</>
					)}
				</Button>
			</div>
			{isCreating && (
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4 mt-4"
					>
						<FormField
							control={form.control}
							name="title"
							render={({field}) => (
								<FormItem>
									<FormControl>
										<Input
											disabled={isSubmitting}
											placeholder="e.g. 'Introduction to the course'"
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
			
			{!isCreating && (
				<div
					className={cn(
						"text-sm mt-2",
						!initialData?.lessons?.length && "text-slate-500 italic"
					)}
				>
					{!initialData?.lessons?.length && "No lessons"}
					<LessonsList
						onEdit={(id) => {
							navigate(`lessons/${id}`)
						}}
						onReorder={onReorder}
						items={initialData?.lessons || []}
					/>
				</div>
			)}
			{!isCreating && (
				<p className="text-xs text-muted-foreground mt-4">
					Drag and drop to reorder the lessons
				</p>
			)}
		</div>
	);
};

export default LessonsForm;