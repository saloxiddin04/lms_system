import React from 'react';
import * as z from "zod"
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {useNavigate, Link} from "react-router-dom";
import {
	Form,
	FormControl,
	FormDescription,
	FormField, FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

import toast from "react-hot-toast";
import {useDispatch} from "react-redux";
import {createCourse} from "@/features/course/courseSlice.js";

const formSchema = z.object({
	title: z.string().min(1, {message: "Title is required!"})
})

const CreateCourse = () => {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: ""
		}
	})
	
	const {isSubmitting, isValid} = form.formState
	
	const onSubmit = async (data) => {
		dispatch(createCourse(data)).then(({payload}) => {
			if (payload) {
				console.log(payload)
				navigate(`${payload?.course?.id}`)
				toast.success("Course created")
			}
		})
	}
	
	return (
		<div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
			<div>
				<h1 className="text-2xl">
					Name your course
				</h1>
				<p className="text-sm text-slate-600">
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur, consectetur corporis cum dignissimos
					ducimus eos, esse et facilis, fuga ipsam iusto non perspiciatis quaerat rem sed similique sunt vitae voluptas!
				</p>
				
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-8 mt-8"
					>
						<FormField
							control={form.control}
							name="title"
							render={({field}) => (
								<FormItem>
									<FormLabel>
										Course title
									</FormLabel>
									<FormControl>
										<Input
											disabled={isSubmitting}
											placeholder="e.g. 'Advanced web development'"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										What will you teach this course?
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						
						<div className="flex items-center gap-x-2">
							<Link to={"/admin/courses"}>
								<Button type="button" variant="ghost">Cancel</Button>
							</Link>
							<Button type="submit" disabled={!isValid || isSubmitting}>
								Continue
							</Button>
						</div>
					</form>
				</Form>
			</div>
		
		</div>
	);
};

export default CreateCourse;
