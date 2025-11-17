import React from 'react';
import {Route, Routes} from "react-router-dom";
import Lesson from "@/pages/Student/Lesson/Lesson.jsx";
import Profile from "@/pages/Profile.jsx";

function Dashboard() {
	return <h2>Dashboard</h2>
}

function ManageCourses() {
	return <h2>Manage Courses</h2>;
}

const TeacherLayout = () => {
	return (
		<div>
			<div className="flex">
				<main className="flex-1 p-6">
					<Routes>
						<Route path="dashboard" element={<Dashboard/>}/>
						<Route path="my-courses" element={<ManageCourses/>}/>
						<Route path="/:courseId/lessons/:lessonId" element={<Lesson/>}/>
						
						<Route path="profile" element={<Profile/>}/>
					</Routes>
				</main>
			</div>
		</div>
	);
};

export default TeacherLayout;