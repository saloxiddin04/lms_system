import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import Loader from "@/components/Loader.jsx";
import {getUser, updateUser} from "@/features/admin/adminSlice.js";
import {z} from "zod";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select.jsx";
import {Switch} from "@/components/ui/switch.jsx";
import {Button} from "@/components/ui/button.jsx";
import toast from "react-hot-toast";
import {fetchMe, updateProfile} from "@/auth/jwtService.js";

const userSchema = z.object({
	email: z.string().min(3, "Email is required"),
	name: z.string().min(3, "Name is required"),
	password: z.string().min(6, "Password must be at least 6 characters long").optional().or(z.literal("")),
});

const Profile = () => {
	const dispatch = useDispatch()
	
	const {loading} = useSelector((state) => state.admin)
	
	const [isLoading, setIsLoading] = useState(false);
	const [serverError, setServerError] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	
	const {
		register,
		control,
		handleSubmit,
		formState: {errors},
		reset
	} = useForm({
		resolver: zodResolver(userSchema),
		defaultValues: {
			email: "",
			name: "",
			password: undefined,
		}
	})
	
	useEffect(() => {
		fetchMe().then((res) => {
			reset({
				email: res?.email ?? "",
				name: res?.name ?? "",
			})
		})
	}, [dispatch])
	
	const onSubmit = (data) => {
		setIsLoading(true);
		setServerError("");
		setSuccessMessage("");
		
		updateProfile({data}).then((res) => {
			toast.success(`User "${data?.name}" updated successfully!`)
			setIsLoading(false);
			reset()
		}).catch(() => {
			setIsLoading(false)
		})
		
		// dispatch(updateUser({data})).then(({payload}) => {
		// 	if (payload?.id) {
		// 		toast.success(`User "${payload?.name}" updated successfully! User ID: ${payload?.id}`)
		// 		setIsLoading(false);
		// 		reset()
		// 	}
		// }).catch((error) => {
		// 	const errorMessage = error.response?.data?.error || error.message || "Failed to update user";
		// 	setServerError(errorMessage);
		// 	setIsLoading(false);
		// }).finally(() => {
		// 	setIsLoading(false);
		// })
	}
	
	if (loading) return <Loader/>
	
	return (
		<div className="container mx-auto py-3 px-4 max-w-4xl">
			<div className="mb-6">
				<h1 className="text-3xl font-bold text-gray-900">Profile</h1>
				<p className="text-gray-600 mt-2">
					Profile
				</p>
			</div>
			
			{/* Server Messages */}
			{serverError && (
				<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
					<strong>Error: </strong> {serverError}
				</div>
			)}
			
			{successMessage && (
				<div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6">
					<strong>Success: </strong> {successMessage}
				</div>
			)}
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
				{/* Course Basic Information */}
				<Card>
					<CardHeader>
						<CardTitle>User Information</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex flex-col gap-1">
							<Label htmlFor="course-title">Email *</Label>
							<Input
								id="course-title"
								{...register("email")}
								placeholder="Enter user email"
								disabled
								className={errors.email ? "border-red-500" : ""}
								readOnly
							/>
							{errors.email && (
								<p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
							)}
						</div>
						
						<div className="flex flex-col gap-1">
							<Label htmlFor="course-name">Name *</Label>
							<Input
								id="name"
								{...register("name")}
								placeholder="Enter user name"
								className={errors.name ? "border-red-500" : ""}
							/>
							{errors.name && (
								<p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
							)}
						</div>
						
						<div className="flex flex-col gap-1">
							<Label htmlFor="course-password">Password</Label>
							<Input
								id="course-password"
								{...register("password")}
								placeholder="Enter password"
								className={errors.password ? "border-red-500" : ""}
							/>
							{errors.password && (
								<p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
							)}
						</div>
					</CardContent>
				</Card>
				
				<div className="flex justify-end space-x-4 pt-6 border-t">
					<Button
						type="submit"
						disabled={isLoading}
						className="min-w-32"
					>
						{isLoading ? (
							<>
								<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
								Updating...
							</>
						) : (
							"Update"
						)}
					</Button>
				</div>
			</form>
		
		
		</div>
	);
};

export default Profile;