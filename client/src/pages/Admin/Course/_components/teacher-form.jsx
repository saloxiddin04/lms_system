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
import {Pencil} from "lucide-react";
import toast from "react-hot-toast";
import {cn} from "@/lib/utils";
import {Textarea} from "@/components/ui/textarea";
import {updateCourse} from "@/features/course/courseSlice.js";
import {useDispatch} from "react-redux";
import ComboboxDemo from "@/components/ui/combobox.jsx";


const formSchema = z.object({
	teacher: z.number().min(1, {message: "Teacher is required!"})
})

const TeacherForm = ({initialData, courseId, options}) => {
	const dispatch = useDispatch()
	const [isEditing, setIsEditing] = useState(false)
	
	const toggleEdit = () => setIsEditing((current) => !current)
	
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			teacher: initialData?.teacher?.id || ""
		}
	})
	
	const {isSubmitting, isValid} = form.formState
	
	const onSubmit = async (data) => {
		await dispatch(updateCourse({id: courseId, formData: data})).then(({payload}) => {
			if (payload) {
				toast.success("Course updated")
			}
		})
	}
	
	const selectedOption = options?.find((option) => option?.value === initialData?.teacher?.id)
	
	return (
		<div className="mt-6 border bg-slate-100 rounded-md p-4">
			<div className="font-medium flex items-center justify-between">
				Course teacher
				<Button onClick={toggleEdit} variant="ghost">
					{isEditing ? (
						<>Cancel</>
					) : (
						<>
							<Pencil className="w-4 h-4 mr-2"/>
							Edit teacher
						</>
					)}
				</Button>
			</div>
			{!isEditing && (
				<p
					className={cn(
						"text-sm mt-2",
						!initialData?.teacher && "text-slate-500 italic"
					)}
				>
					{selectedOption?.label || "No option"}
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
							name="teacher"
							render={({field}) => (
								<FormItem>
									<FormControl>
										<ComboboxDemo
											options={options}
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

export default TeacherForm;