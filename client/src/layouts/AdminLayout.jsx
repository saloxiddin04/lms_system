import React from 'react';
import {Route, Routes} from "react-router-dom";
import Course from "@/pages/Admin/Course/Course.jsx";
import CreateCourse from "@/pages/Admin/Course/CreateCourse.jsx";
import Category from "@/pages/Admin/Category/Category.jsx";
import CreateCategory from "@/pages/Admin/Category/CreateCategory.jsx";
import Users from "@/pages/Admin/Users/Users.jsx";
import UserDetail from "@/pages/Admin/Users/UserDetail.jsx";
import CreateCourseDetail from "@/pages/Admin/Course/CreateCourseDetail.jsx";
import CreateLessonDetail from "@/pages/Admin/Lessons/CreateLessonDetail.jsx";
import Profile from "@/pages/Profile.jsx";
import Dashboard from "@/pages/Admin/Dashboard/Dashboard.jsx";

const AdminLayout = () => {
	return (
		<div>
			<div className="flex">
				<main className="flex-1 p-6">
					<Routes>
						<Route path="dashboard" element={<Dashboard/>}/>
						
						<Route path="users" element={<Users/>}/>
						<Route path="users/:id" element={<UserDetail/>}/>
						
						<Route path="courses" element={<Course/>}/>
						<Route path="courses/create-course" element={<CreateCourse/>}/>
						<Route path="courses/create-course/:id" element={<CreateCourseDetail/>}/>
						
						<Route path="courses/create-course/:courseId/lessons/:id" element={<CreateLessonDetail/>}/>
						
						<Route path="category" element={<Category/>}/>
						<Route path="category/:id" element={<CreateCategory/>}/>
						
						<Route path="profile" element={<Profile/>}/>
					</Routes>
				</main>
			</div>
		</div>
	);
};

export default AdminLayout;