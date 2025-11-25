import React from 'react';
import {Route, Routes} from "react-router-dom";
import Lesson from "@/pages/Student/Lesson/Lesson.jsx";
import Profile from "@/pages/Profile.jsx";
import MyCourses from "@/pages/Student/Course/MyCourses.jsx";
import Dashboard from "@/pages/Student/Dashboard/Dashboard.jsx";

const StudentLayout = () => {
	return (
		<div>
			<div className="flex">
				<main className="flex-1 p-6">
					<Routes>
						<Route path="dashboard" element={<Dashboard/>}/>
						<Route path="my-courses" element={<MyCourses/>}/>
						<Route path="/:courseId/lessons/:lessonId" element={<Lesson/>}/>
						
						<Route path="profile" element={<Profile/>}/>
					</Routes>
				</main>
			</div>
		</div>
	);
};

export default StudentLayout;