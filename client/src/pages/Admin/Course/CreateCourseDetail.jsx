import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from "react-redux";
import {useParams} from "react-router-dom";
import Confetti from "react-confetti";
import TitleForm from "@/pages/Admin/Course/_components/title-form.jsx";
import {IconBadge} from "@/components/IconBadge.jsx";
import {LayoutDashboard, ListChecks, CircleDollarSign} from "lucide-react";
import {getCourseById} from "@/features/course/courseSlice.js";
import DescriptionForm from "@/pages/Admin/Course/_components/description-form.jsx";
import ImageForm from "@/pages/Admin/Course/_components/image-form.jsx";
import CategoryForm from "@/pages/Admin/Course/_components/category-form.jsx";
import {getCategories} from "@/features/category/categorySlice.js";
import PriceForm from "@/pages/Admin/Course/_components/price-form.jsx";
import LessonsForm from "@/pages/Admin/Course/_components/lessons-form.jsx";
import Banner from "@/components/Banner.jsx";
import CourseTopActions from "@/pages/Admin/Course/_components/course-top-actions.jsx";
import {getUserData} from "@/auth/jwtService.js";
import TeacherForm from "@/pages/Admin/Course/_components/teacher-form.jsx";
import {getTeachers} from "@/features/admin/adminSlice.js";

const CreateCourseDetail = () => {
	const dispatch = useDispatch()
	
	const user = getUserData()
	
	const {id} = useParams()
	
	const {course, loading} = useSelector((state) => state.course)
	const {categories} = useSelector((state) => state.category)
	const {teachers} = useSelector((state) => state.admin)
	
	const [showConfetti, setShowConfetti] = useState(false);
	
	useEffect(() => {
		dispatch(getCategories())
		dispatch(getCourseById({id}))
	}, [id, dispatch])
	
	useEffect(() => {
		if (user?.role === "admin") {
			dispatch(getTeachers())
		}
	}, [id, dispatch, user])
	
	const requiredFields = [
		course?.title,
		course?.description,
		course?.preview_image,
		course?.price_cents,
		course?.category?.id,
		course?.lessons?.some(lesson => lesson?.is_published),
		
		user?.role === "admin" ? course?.teacher_id : true
	]
	const totalFields = requiredFields.length
	const completedFields = requiredFields.filter(Boolean).length
	
	const completionText = `(${completedFields}/${totalFields})`
	
	const complete = requiredFields.every(Boolean)
	
	const handlePublishSuccess = () => {
		setShowConfetti(true);
		setTimeout(() => setShowConfetti(false), 5000);
	};
	
	// if (loading) return <Loader />
	
	return (
		<>
			{showConfetti && (
				<Confetti
					width={window.innerWidth}
					height={window.innerHeight}
					recycle={true}
					numberOfPieces={300}
					gravity={0.5}
				/>
			)}
			
			{!course?.published && (
				<Banner
					label={"This course is unpublished. It will not be visible to the students."}
				/>
			)}
			<div className="py-6">
				<div className="flex items-center justify-between">
					<div className="flex flex-col gap-y-2">
						<h1 className="text-2xl font-medium">
							Course setup
						</h1>
						<span className="text-sm text-slate-700">
						Complete all fields {completionText}
					</span>
					</div>
					<CourseTopActions
						disabled={!complete}
						courseId={id}
						isPublished={course?.published}
						onPublishSuccess={handlePublishSuccess}
					/>
				</div>
				
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
					<div>
						<div className="flex items-center gap-x-2">
							<IconBadge icon={LayoutDashboard}/>
							<h2 className="text-xl">Customize your course</h2>
						</div>
						<TitleForm
							initialData={course}
							courseId={course?.id}
						/>
						<DescriptionForm
							initialData={course}
							courseId={course?.id}
						/>
						<ImageForm
							initialData={course}
							courseId={course?.id}
						/>
						<CategoryForm
							initialData={course}
							courseId={course?.id}
							options={categories?.map((option) => ({
								label: option?.name,
								value: option?.id
							}))}
						/>
					</div>
					
					<div className="space-y-6">
						<div>
							<div className="flex items-center gap-x-2">
								<IconBadge icon={ListChecks}/>
								<h2 className="text-xl">Course lessons</h2>
							</div>
							<LessonsForm
								initialData={course}
								courseId={course?.id}
							/>
						</div>
						
						<div>
							<div className="flex items-center gap-x-2">
								<IconBadge icon={CircleDollarSign}/>
								<h2 className="text-xl">Cell your course</h2>
							</div>
							<PriceForm
								initialData={course}
								courseId={course?.id}
							/>
							{user?.role === "admin" && (
								<TeacherForm
									initialData={course}
									courseId={course?.id}
									options={teachers?.map((option) => ({
										label: option?.name,
										value: option?.id
									}))}
								/>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default CreateCourseDetail;