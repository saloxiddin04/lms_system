import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getTeacherDashboard} from "@/features/dashboard/dashboardSlice.js";
import {Card, CardContent} from "@/components/ui/card.jsx";
import {BookOpen, Users, DollarSign} from "lucide-react";

const Dashboard = () => {
	const dispatch = useDispatch()
	
	const {teacherDashboard} = useSelector(state => state.dashboard)
	
	useEffect(() => {
		dispatch(getTeacherDashboard())
	}, [dispatch])
	
	return (
		<div className="space-y-4">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				
				<Card className="shadow-md rounded-xl">
					<CardContent className="p-5 flex items-center gap-4">
						<BookOpen className="w-10 h-10"/>
						<div>
							<p className="text-gray-500 text-sm">My Courses</p>
							<p className="text-xl font-semibold">{teacherDashboard?.totalCourses}</p>
						</div>
					</CardContent>
				</Card>
				
				<Card className="shadow-md rounded-xl">
					<CardContent className="p-5 flex items-center gap-4">
						<Users className="w-10 h-10"/>
						<div>
							<p className="text-gray-500 text-sm">Total Students</p>
							<p className="text-xl font-semibold">{teacherDashboard?.totalStudents}</p>
						</div>
					</CardContent>
				</Card>
				
				<Card className="shadow-md rounded-xl">
					<CardContent className="p-5 flex items-center gap-4">
						<DollarSign className="w-10 h-10"/>
						<div>
							<p className="text-gray-500 text-sm">Total Revenue</p>
							<p className="text-xl font-semibold">${(teacherDashboard?.totalRevenue / 100).toFixed(2)}</p>
						</div>
					</CardContent>
				</Card>
			
			</div>
			
			<Card className="shadow-md rounded-xl">
				<CardContent className="p-5">
					<h2 className="text-lg font-semibold mb-4">Top Courses</h2>
					
					{teacherDashboard?.topCourses.length === 0 ? (
						<p className="text-sm text-gray-500">No sales yet.</p>
					) : (
						<div className="space-y-3">
							{teacherDashboard?.topCourses.map((course) => (
								<div
									key={course?.id}
									className="flex items-center justify-between border p-3 rounded-lg"
								>
									<p>{course?.title}</p>
									<span className="text-sm text-gray-600">
                    {course?.total_students} students
                  </span>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		
		</div>
	);
};

export default Dashboard;