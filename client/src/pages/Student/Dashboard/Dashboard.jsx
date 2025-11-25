import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {getStudentDashboard} from "@/features/dashboard/dashboardSlice.js";
import Loader from "@/components/Loader.jsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Progress} from "@radix-ui/react-progress";
import {Button} from "@/components/ui/button.jsx";
import {Badge} from "@/components/ui/badge.jsx";
import {ArrowRight, BookOpen, CheckCircle, DollarSign, TrendingUp, Clock} from "lucide-react";
import instance from "@/utils/axios.js";

const Dashboard = () => {
	
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { studentDashboard, loading } = useSelector(state => state.dashboard);
	
	useEffect(() => {
		dispatch(getStudentDashboard())
	}, [dispatch])
	
	if (loading) return <Loader />;
	if (!studentDashboard) return <div>No data found</div>;
	
	const { stats, recentCourses, progressByCourse } = studentDashboard;
	
	const StatCard = ({ title, value, icon: Icon, description, color = "blue" }) => (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
				<Icon className={`h-4 w-4 text-${color}-500`} />
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{value}</div>
				<p className="text-xs text-muted-foreground">{description}</p>
			</CardContent>
		</Card>
	);
	
	const CourseProgressCard = ({ course }) => (
		<Card className="cursor-pointer hover:shadow-md transition-shadow"
		      onClick={() => navigate(`/course/${course.id}`)}>
			<CardContent className="p-4">
				<div className="flex justify-between items-start mb-2">
					<h4 className="font-semibold text-sm line-clamp-2 flex-1 mr-2">
						{course.title}
					</h4>
					<Badge variant="outline" className="text-xs whitespace-nowrap">
						{course.progress_percent}%
					</Badge>
				</div>
				<Progress value={course.progress_percent} className="h-2 mb-2" />
				<div className="flex justify-between text-xs text-muted-foreground">
					<span>{course.completed_lessons}/{course.total_lessons} lessons</span>
					<span>{course.teacher_name}</span>
				</div>
			</CardContent>
		</Card>
	);
	
	const RecentCourseCard = ({ course }) => (
		<div className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-slate-50 cursor-pointer"
		     onClick={() => navigate(`/course/${course.id}`)}>
			{course.preview_image ? (
				<img
					src={instance.defaults.baseURL + course.preview_image}
					alt={course.title}
					className="w-12 h-12 rounded-lg object-cover"
				/>
			) : (
				<div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
					<BookOpen className="h-6 w-6 text-blue-600" />
				</div>
			)}
			<div className="flex-1 min-w-0">
				<h4 className="font-medium text-sm truncate">{course.title}</h4>
				<p className="text-xs text-muted-foreground truncate">{course.teacher_name}</p>
				<div className="flex items-center gap-2 mt-1">
					<Progress value={course.progress_percent} className="h-1 flex-1" />
					<span className="text-xs text-muted-foreground">{course.progress_percent}%</span>
				</div>
			</div>
		</div>
	);
	
	
	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
					<p className="text-muted-foreground">Track your learning progress and achievements</p>
				</div>
				<Button onClick={() => navigate('/courses')}>
					Browse Courses
					<ArrowRight className="h-4 w-4 ml-2" />
				</Button>
			</div>
			
			{/* Stats Grid */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<StatCard
					title="Total Courses"
					value={stats.totalCourses}
					icon={BookOpen}
					description="Enrolled courses"
					color="blue"
				/>
				<StatCard
					title="Completed Lessons"
					value={stats.completedLessons}
					icon={CheckCircle}
					description="Lessons finished"
					color="green"
				/>
				<StatCard
					title="Total Spent"
					value={`$${(stats.totalSpent / 100).toFixed(2)}`}
					icon={DollarSign}
					description="Total investment"
					color="amber"
				/>
				<StatCard
					title="Overall Progress"
					value={`${stats.overallProgress}%`}
					icon={TrendingUp}
					description="Learning progress"
					color="purple"
				/>
			</div>
			
			<div className="grid gap-6 lg:grid-cols-2">
				{/* Recent Courses */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Clock className="h-5 w-5" />
							Recent Courses
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						{recentCourses.length > 0 ? (
							recentCourses.map((course) => (
								<RecentCourseCard key={course.id} course={course} />
							))
						) : (
							<div className="text-center py-8 text-muted-foreground">
								<BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
								<p>No courses enrolled yet</p>
								<Button
									variant="outline"
									className="mt-2"
									onClick={() => navigate('/courses')}
								>
									Browse Courses
								</Button>
							</div>
						)}
					</CardContent>
				</Card>
				
				{/* Course Progress */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<TrendingUp className="h-5 w-5" />
							Course Progress
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{progressByCourse.length > 0 ? (
							progressByCourse.map((course) => (
								<CourseProgressCard key={course.id} course={course} />
							))
						) : (
							<div className="text-center py-8 text-muted-foreground">
								<p>Start learning to see your progress</p>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
			
			{recentCourses.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle>Continue Learning</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{recentCourses.slice(0, 3).map((course) => (
								<Card key={course.id} className="cursor-pointer hover:shadow-lg transition-all"
								      onClick={() => navigate(`/course/${course.id}`)}>
									<CardContent className="p-4">
										<div className="space-y-3">
											{course.preview_image ? (
												<img
													src={instance.defaults.baseURL + course.preview_image}
													alt={course.title}
													className="w-full h-32 object-cover rounded-lg"
												/>
											) : (
												<div className="w-full h-32 rounded-lg bg-blue-100 flex items-center justify-center">
													<BookOpen className="h-8 w-8 text-blue-600" />
												</div>
											)}
											<div>
												<h4 className="font-semibold text-sm line-clamp-2 mb-1">
													{course.title}
												</h4>
												<p className="text-xs text-muted-foreground mb-2">
													{course.teacher_name}
												</p>
												<div className="flex items-center justify-between">
													<Badge variant={course.progress_percent > 0 ? "default" : "secondary"}>
														{course.progress_percent}% complete
													</Badge>
													<Button size="sm" variant="ghost">
														Continue
													</Button>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	)
};

export default Dashboard;