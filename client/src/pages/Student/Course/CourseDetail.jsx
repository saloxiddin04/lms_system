import React, {useEffect} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import Navbar from "@/components/Navbar.jsx";
import {PlayCircle} from "lucide-react";
import {Button} from "@/components/ui/button.jsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import moment from "moment";
import instance from "@/utils/axios.js";
import {Separator} from "@radix-ui/react-separator";
import {getCourseById} from "@/features/course/courseSlice.js";
import toast from "react-hot-toast";
import VideoPlayer from "@/components/VideoPlayer.jsx";
import {enrollCourse} from "@/features/enroll/enrollSlice.js";
import {getUserData} from "@/auth/jwtService.js";
import Loader from "@/components/Loader.jsx";

const CourseDetail = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const {id} = useParams()
	
	const user = getUserData()
	
	const {course, loading} = useSelector(state => state.course)
	const { loading: enrollLoading } = useSelector(state => state.enroll);
	
	useEffect(() => {
		if (id) {
			dispatch(getCourseById({id}))
		}
	}, [id, dispatch])
	
	const handleEnroll = () => {
		dispatch(enrollCourse({ id })).then(({ payload }) => {
			if (payload?.ok && payload?.message?.includes("Enrolled")) {
				toast.success("You have successfully enrolled in the course!");
				dispatch(getCourseById({ id }));
			} else if (payload?.url) {
				window.location.href = payload.url;
			} else {
				toast.error(payload?.error || "Something went wrong");
			}
		});
	};
	
	const handleNavigate = () => {
		navigate(`/student/${id}/lessons/${course?.lessons[0]?.id}`)
	}
	
	if (loading) return <div className="flex justify-center items-center h-screen"><Loader /></div>
	
	return (
		<div>
			<Navbar/>
			
			<div className="container mx-auto py-20">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<Card className="md:col-span-2 space-y-1">
						<CardHeader>
							<CardTitle className={"text-2xl"}>{course?.title}</CardTitle>
						</CardHeader>
						<CardContent className="text-sm text-gray-700">
							<p className="text-gray-600 leading-relaxed text-lg">{course?.description}</p>
							
							<div className="flex items-center gap-4 text-lg text-gray-500">
								<span>👨‍🏫 {course?.teacher_name}</span>
								<span>📅 {moment(course?.created_at).format("DD-MM-YYYY")}</span>
								<span>🎓 {course?.lessons?.length} lessons</span>
							</div>
						</CardContent>
					</Card>
					
					{/* Course Image + Price */}
					<Card className="overflow-hidden border shadow-sm">
						{course?.lessons?.find((el) => el?.is_preview) && (
							<VideoPlayer
								className={"p-2"}
								url={instance.defaults.baseURL + course?.lessons?.find((el) => el?.is_preview)?.video_url}
							/>
						)}
						<CardContent className="p-4 space-y-3">
							<div>
								<span className="block text-gray-500 text-sm">Price</span>
								{course?.price_cents === "0.00" ? (
									<span className="text-green-600 font-semibold text-lg">Free</span>
								) : (
									<span className="text-gray-800 font-semibold text-lg">
                  {course?.price_cents} {course?.currency.toUpperCase()}
                </span>
								)}
							</div>
							{user?.verify && (
								<Button
									className="w-full"
									onClick={course?.enrolled ? handleNavigate : handleEnroll}
									disabled={enrollLoading}
								>
									{course?.enrolled ? "View course" : "Purchase"}
									<PlayCircle className="ml-2 w-4 h-4"/>
								</Button>
							)}
						</CardContent>
					</Card>
				</div>
				
				<Separator className="my-5"/>
				
				{/* Kurs dasturi */}
				<div className="space-y-4">
					<h2 className="text-2xl font-semibold">Course program</h2>
					
					<Card>
						<CardContent className="divide-y">
							{course?.lessons?.length > 0 ? (
								course?.lessons?.map((lesson, index) => (
									<div
										key={lesson?.id}
										className="py-3 flex items-center justify-between"
									>
										<div className="flex items-center gap-2">
											<span className="text-gray-500 text-sm">#{index + 1}</span>
											<span>{lesson?.title}</span>
										</div>
										{lesson?.is_preview ? (
											<Button
												size="sm"
												variant="outline"
												onClick={() => toast.success("Teginga dars ochildi!")}
											>
												<PlayCircle className="w-4 h-4"/>
											</Button>
										) : (
											<Button size="sm" variant="outline">
												<PlayCircle className="w-4 h-4"/>
											</Button>
										)}
									</div>
								))
							) : (
								<p className="text-sm text-gray-500 py-3">
									There are no lessons available yet.
								</p>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default CourseDetail;