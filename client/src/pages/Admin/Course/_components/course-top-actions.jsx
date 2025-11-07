import React from 'react';
import {Button} from "@/components/ui/button.jsx";
import {useDispatch} from "react-redux";
import toast from "react-hot-toast";
import {togglePublishCourse} from "@/features/course/courseSlice.js";

const LessonTopActions = ({disabled, courseId, isPublished, onPublishSuccess}) => {
	const dispatch = useDispatch()
	
	const togglePublish = () => {
		dispatch(togglePublishCourse({id: courseId, published: !isPublished})).then(({payload}) => {
			if (payload?.id) {
				if (payload?.id) {
					if (!isPublished) {
						toast.success("Course published successfully");
						onPublishSuccess?.();
					} else {
						toast.success("Course unpublished successfully");
					}
				}
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