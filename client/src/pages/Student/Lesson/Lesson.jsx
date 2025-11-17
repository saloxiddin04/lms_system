import React, {useEffect} from 'react';
import VideoPlayer from "@/components/VideoPlayer.jsx";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {getLessonById} from "@/features/course/lessonSlice.js";
import instance from "@/utils/axios.js";
import Loader from "@/components/Loader.jsx";
import {Button} from "@/components/ui/button.jsx";
import {ChevronRightIcon, FilesIcon} from "lucide-react";
import Preview from "@/components/Preview.jsx";

const Lesson = () => {
	const dispatch = useDispatch()
	const {lessonId} = useParams()
	const {loading, lesson} = useSelector(state => state.lesson)
	
	useEffect(() => {
		dispatch(getLessonById({id: lessonId}))
	}, [lessonId])
	
	return (
		<div className="flex flex-col flex-wrap">
			<div className="p-4 aspect-video">
				{loading ? (
					<div className="w-full p-4">
						<Loader/>
					</div>
				) : (
					<VideoPlayer
						url={instance.defaults.baseURL + lesson?.video_url}
					/>
				)}
			</div>
			<div>
				<div className="p-4 flex items-center justify-between">
					<h2 className="text-2xl font-semibold mb-2">#{lesson?.order_index + 1}.{lesson?.title}</h2>
					<div>
						<Button variant={"default"}>
							Next lesson
							<ChevronRightIcon className="w-4 h-4"/>
						</Button>
					</div>
				</div>
				<div className="w-full border-t">
					<Preview value={lesson?.content}/>
					<a href={lesson?.link} className="flex items-center text-2xl">
						<FilesIcon className="w-4 h-4"/>
						File
					</a>
				</div>
			</div>
		</div>
	);
};

export default Lesson;