import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Link, useParams} from "react-router-dom";
import {ArrowLeft, LayoutDashboard, Eye} from "lucide-react";
import {IconBadge} from "@/components/IconBadge.jsx";
import {getLessonById} from "@/features/course/lessonSlice.js";
import LessonTitleForm from "@/pages/Admin/Lessons/_components/lesson-title-form.jsx";
import Loader from "@/components/Loader.jsx";
import LessonContentForm from "@/pages/Admin/Lessons/_components/lesson-content-form.jsx";
import LessonAccessSettings from "@/pages/Admin/Lessons/_components/lesson-access-settings.jsx";

const CreateLessonDetail = () => {
	const dispatch = useDispatch()
	
	const {id, courseId} = useParams()
	
	const {lesson, loading} = useSelector((state) => state.lesson)
	
	useEffect(() => {
		dispatch(getLessonById({id}))
	}, [dispatch, id])
	
	const requiredFields = [
		lesson?.title,
		lesson?.content,
		lesson?.video_url,
	]
	const totalFields = requiredFields.length
	const completedFields = requiredFields.filter(Boolean).length
	
	const completionText = `(${completedFields}/${totalFields})`
	
	if (loading) return <Loader />
	
	return (
		<div>
			<div className="flex items-center justify-between">
				<div className="w-full">
					<Link
						to={`/admin/courses/create-course/${courseId}`}
						className="flex items-center text-sm hover:opacity-75 transition mb-6"
					>
						<ArrowLeft className="w-4 h-4 mr-2"/>
						Back to course setup
					</Link>
					<div className="flex items-center justify-between w-full">
						<div className="flex flex-col gap-y-2">
							<h1 className="text-2xl font-medium">Lesson creation</h1>
							<span className="text-sm text-slate-700">Complete all fields {completionText}</span>
						</div>
					</div>
				</div>
			</div>
			
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
				<div className="space-y-4">
					<div>
						<div className="flex items-center gap-x-2">
							<IconBadge icon={LayoutDashboard}/>
							<h2 className="text-xl">Customize your lesson</h2>
						</div>
						<LessonTitleForm
							initialData={lesson}
							lessonId={id}
						/>
						<LessonContentForm
							initialData={lesson}
							lessonId={id}
						/>
					</div>
					
					<div>
						<div className="flex items-center gap-x-2">
							<IconBadge icon={Eye}/>
							<h2 className="text-xl">Access settings</h2>
						</div>
						<LessonAccessSettings
							initialData={lesson}
							lessonId={id}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CreateLessonDetail;