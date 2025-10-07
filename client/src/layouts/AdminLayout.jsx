import React from 'react';
import {Route, Routes} from "react-router-dom";
import Course from "@/pages/Admin/Course/Course.jsx";
import CreateCourse from "@/pages/Admin/Course/CreateCourse.jsx";
import CreateLessons from "@/pages/Admin/Lessons/CreateLessons.jsx";
import Category from "@/pages/Admin/Category/Category.jsx";
import CreateCategory from "@/pages/Admin/Category/CreateCategory.jsx";

function Dashboard() {
	return <h2>Dashboard</h2>
}

function ManageUsers() {
	return <h2>Manage Users</h2>;
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
						<Route path="users" element={<ManageUsers/>}/>
						
						<Route path="courses" element={<Course/>}/>
						<Route path="courses/:id" element={<CreateCourse/>}/>
						
						<Route path="courses/:courseId/lessons/:id" element={<CreateLessons/>}/>
						
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