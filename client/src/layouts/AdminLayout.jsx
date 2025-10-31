import React from 'react';
import {Route, Routes} from "react-router-dom";
import Course from "@/pages/Admin/Course/Course.jsx";
import CreateCourse from "@/pages/Admin/Course/CreateCourse.jsx";
import CreateLessons from "@/pages/Admin/Lessons/CreateLessons.jsx";
import Category from "@/pages/Admin/Category/Category.jsx";
import CreateCategory from "@/pages/Admin/Category/CreateCategory.jsx";
import Users from "@/pages/Admin/Users/Users.jsx";
import UserDetail from "@/pages/Admin/Users/UserDetail.jsx";
import Lessons from "@/pages/Admin/Lessons/Lessons.jsx";
import CreateCourseDetail from "@/pages/Admin/Course/CreateCourseDetail.jsx";

function Dashboard() {
	return <h2>Dashboard</h2>
}

function PaymentsOverview() {
	return <h2>Payments Overview</h2>;
}

function Statistics() {
	return <h2>Statistics</h2>;
}

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
						
						<Route path="lessons" element={<Lessons/>}/>
						<Route path="lessons/create-lesson/:courseId" element={<CreateLessons/>}/>
						
						<Route path="category" element={<Category/>}/>
						<Route path="category/:id" element={<CreateCategory/>}/>
						
						<Route path="payments" element={<PaymentsOverview/>}/>
						<Route path="stats" element={<Statistics/>}/>
					</Routes>
				</main>
			</div>
		</div>
	);
};

export default AdminLayout;