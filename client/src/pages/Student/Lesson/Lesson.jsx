import React, {useEffect} from 'react';
import VideoPlayer from "@/components/VideoPlayer.jsx";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {getLessonById, getLessonsByCourseId, progressLesson} from "@/features/course/lessonSlice.js";
import instance from "@/utils/axios.js";
import Loader from "@/components/Loader.jsx";
import {Button} from "@/components/ui/button.jsx";
import {ChevronRightIcon, FilesIcon} from "lucide-react";
import Preview from "@/components/Preview.jsx";
import {getCourseById} from "@/features/course/courseSlice.js";

const Lesson = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	
	const {lessonId, courseId} = useParams()
	const {loading, lesson} = useSelector(state => state.lesson)
	
	useEffect(() => {
		dispatch(getLessonById({id: lessonId}))
	}, [lessonId, dispatch])
	
	const handleProgress = () => {
		dispatch(progressLesson({lessonId, courseId})).then(({payload}) => {
			if (payload?.nextLesson) {
				navigate(`/student/${courseId}/lessons/${payload?.nextLesson?.id}`)
				dispatch(getLessonsByCourseId({courseId}))
			} else {
				dispatch(getLessonsByCourseId({courseId}))
				dispatch(getCourseById({id: courseId}))
			}
		})
	}
	
	return (
		<div className="flex flex-col flex-wrap">
			<div className="p-4 aspect-video">
				{loading ? (
					<div className="w-full p-4">
						<Loader/>
					</div>
				) : (
					<VideoPlayer
						className={"h-full"}
						url={instance.defaults.baseURL + lesson?.video_url}
					/>
				)}
			</div>
			<div>
				<div className="p-4 flex items-center justify-between">
					<h2 className="text-2xl font-semibold mb-2">#{lesson?.order_index + 1}.{lesson?.title}</h2>
					<div>
						<Button
							variant={"default"}
							onClick={handleProgress}
						>
							Next lesson
							<ChevronRightIcon className="w-4 h-4"/>
						</Button>
					</div>
				</div>
				<div className="w-full border-t">
					<Preview value={lesson?.content}/>
					{lesson?.link && (
						<a href={lesson?.link} target="_blank"
						   className="flex items-center text-2xl text-blue-600 cursor-pointer gap-2">
							<FilesIcon className="w-6 h-6"/>
							File
						</a>
					)}
				</div>
			</div>
		</div>
	);
};

export default Lesson;