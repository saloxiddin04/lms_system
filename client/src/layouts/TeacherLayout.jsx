import React from 'react';
import {Route, Routes} from "react-router-dom";

function Dashboard() {
	return <h2>Dashboard</h2>
}

function ManageCourses() {
	return <h2>Manage Courses</h2>;
}

function Students() {
	return <h2>Students</h2>;
}

const TeacherLayout = () => {
	return (
		<div>
			<div className="flex">
				<main className="flex-1 p-6">
					<Routes>
						<Route path="dashboard" element={<Dashboard/>}/>
						<Route path="courses" element={<ManageCourses/>}/>
						<Route path="students" element={<Students/>}/>
					</Routes>
				</main>
			</div>
		</div>
	);
};

export default TeacherLayout;