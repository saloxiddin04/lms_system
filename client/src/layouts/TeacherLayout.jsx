import React from 'react';
import {Route, Routes} from "react-router-dom";
import Dashboard from "@/pages/Teacher/Dashboard/Dashboard.jsx";

import Course from "@/pages/Admin/Course/Course.jsx";
import CreateCourse from "@/pages/Admin/Course/CreateCourse.jsx";
import CreateCourseDetail from "@/pages/Admin/Course/CreateCourseDetail.jsx";
import CreateLessonDetail from "@/pages/Admin/Lessons/CreateLessonDetail.jsx";
import Profile from "@/pages/Profile.jsx";

const TeacherLayout = () => {
	return (
		<div>
			<div className="flex">
				<main className="flex-1 p-6">
					<Routes>
						<Route path="dashboard" element={<Dashboard/>}/>
						<Route path="courses" element={<Course/>}/>
						<Route path="courses/create-course" element={<CreateCourse/>}/>
						<Route path="courses/create-course/:id" element={<CreateCourseDetail/>}/>
						
						<Route path="courses/create-course/:courseId/lessons/:id" element={<CreateLessonDetail/>}/>
						
						<Route path="profile" element={<Profile/>}/>
					</Routes>
				</main>
			</div>
		</div>
	);
};

export default TeacherLayout;