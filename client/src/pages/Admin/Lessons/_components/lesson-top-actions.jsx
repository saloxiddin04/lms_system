import React from 'react';
import {Button} from "@/components/ui/button.jsx";
import {useDispatch} from "react-redux";
import {togglePublishLesson} from "@/features/course/lessonSlice.js";
import toast from "react-hot-toast";

const LessonTopActions = ({disabled, lessonId, isPublished}) => {
	const dispatch = useDispatch()
	
	const togglePublish = () => {
		dispatch(togglePublishLesson({id: lessonId, is_published: !isPublished})).then(({payload}) => {
			if (payload?.id) {
				toast.success(isPublished ? "Lesson unpublished successfully" : "Lesson published successfully")
			}
		})
	}
	
	return (
		<div className="flex items-center gap-x-2">
			<Button
				disabled={disabled}
				variant={"outline"}
				size={"sm"}
				onClick={togglePublish}
			>
				{isPublished ? "Unpublish" : "Publish"}
			</Button>
		</div>
	);
};

export default LessonTopActions;