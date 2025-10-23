import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getCourses, togglePublishCourse} from "@/features/course/courseSlice.js";
import Loader from "@/components/Loader.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Badge} from "@/components/ui/badge.jsx";
import instance from "@/utils/axios.js";
import Header from "@/components/Header.jsx";
import {useNavigate} from "react-router-dom";

const TopSideButtons = () => {
	const navigate = useNavigate()
	
	return (
		<Button
			size="sm"
			variant="default"
			onClick={() => navigate('create-course')}
		>
			Create course
		</Button>
	)
}

const Course = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	
	const {courses, loading} = useSelector((state) => state.course);
	
	useEffect(() => {
		dispatch(getCourses())
	}, [dispatch])
	
	if (loading) return <Loader/>
	
	return (
		<>
			<Header title={"Courses"} buttons={<TopSideButtons/>} />
			<div className="my-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{courses?.map((course) => (
					<Card key={course.id} className="shadow-md rounded-xl">
						<CardHeader>
							<CardTitle className="flex items-center justify-between">
								{course.title}
								{course.published ? (
									<Badge variant="success">Published</Badge>
								) : (
									<Badge variant="secondary">Draft</Badge>
								)}
							</CardTitle>
						</CardHeader>
						
						<CardContent className="space-y-3">
							{course.preview_image && (
								<img
									src={instance.defaults.baseURL + course?.preview_image}
									alt={course?.title}
									className="w-full h-40 object-cover rounded-lg"
								/>
							)}
							<p className="text-sm text-gray-600">{course.description}</p>
							<p className="text-sm">
								<strong>Teacher:</strong> {course.teacher.name} ({course.teacher.email})
							</p>
							<p className="text-sm">
								<strong>Price:</strong> {course.price_cents} {course.currency}
							</p>
							<div className="flex gap-2 mt-3">
								<Button
									size="sm"
									variant="outline"
									onClick={() => navigate(`create-course/${course.id}`)}
								>
									Edit
								</Button>
								<Button
									size="sm"
									variant="default"
									onClick={() =>
										dispatch(togglePublishCourse({id: course.id, published: !course.published}))
									}
								>
									{course.published ? "Unpublish" : "Publish"}
								</Button>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</>
	);
};

export default Course;