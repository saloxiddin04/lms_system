import { useEffect } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell
} from 'recharts';
import {getAdminDashboardData} from "@/features/dashboard/dashboardSlice.js";
import {useDispatch, useSelector} from "react-redux";
import {Book, DollarSign, GraduationCap, UserStar} from "lucide-react";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function AdminDashboard() {
	const dispatch = useDispatch();
	const {
		adminDashboard,
		loading
	} = useSelector((state) => state.dashboard);
	
	useEffect(() => {
		dispatch(getAdminDashboardData());
	}, [dispatch]);
	
	const handleRetry = () => {
		dispatch(getAdminDashboardData());
	};
	
	// Ma'lumotlarni olish
	const earnings = adminDashboard?.earnings?.courses || [];
	const topTeachers = adminDashboard?.teachers || [];
	const topStudents = adminDashboard?.students || [];
	const grandTotal = adminDashboard?.earnings?.grand_total || 0;
	
	const formattedTeachers = topTeachers?.map(teacher => ({
		name: teacher.name || 'Unknown Teacher',
		total_earned: Number(teacher.total_earned) || 0,
		total_sales: teacher.total_sales || 0
	})) || [];
	
	// Statistikani hisoblash
	const stats = {
		totalRevenue: grandTotal / 100,
		totalCourses: earnings.length,
		totalTeachers: topTeachers.length,
		totalStudents: topStudents.reduce((acc, student) => acc + student?.total_purchases, 0)
	};
	
	if (loading && !adminDashboard) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
			</div>
		);
	}
	
	return (
		<div className="p-6 space-y-6">
			{/* Stats Overview */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<StatCard
					title="Total Revenue"
					value={`$${stats?.totalRevenue?.toLocaleString()}`}
					description="Total platform revenue"
					icon={<DollarSign/>}
				/>
				<StatCard
					title="Total Courses"
					value={stats?.totalCourses?.toLocaleString()}
					description="Published courses"
					icon={<Book/>}
				/>
				<StatCard
					title="Active Teachers"
					value={stats?.totalTeachers?.toLocaleString()}
					description="Registered teachers"
					icon={<UserStar/>}
				/>
				<StatCard
					title="Student Purchases"
					value={stats?.totalStudents?.toLocaleString()}
					description="Total course purchases"
					icon={<GraduationCap/>}
				/>
			</div>
			
			{/* Charts Section */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Revenue by Course */}
				<Card>
					<CardHeader>
						<CardTitle>Revenue by Course</CardTitle>
						<CardDescription>Top earning courses</CardDescription>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<BarChart data={earnings?.slice(0, 5)}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis
									dataKey="course_title"
									angle={-45}
									textAnchor="end"
									height={80}
								/>
								<YAxis />
								<Tooltip
									formatter={(value) => [`$${(value/100).toFixed(2)}`, 'Revenue']}
								/>
								<Legend />
								<Bar
									dataKey="total_earned"
									fill="#8884d8"
									name="Revenue ($)"
								/>
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
				
				{/* Teachers Distribution */}
				<Card>
					<CardHeader>
						<CardTitle>Top Teachers</CardTitle>
						<CardDescription>Revenue distribution</CardDescription>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<PieChart>
								<Pie
									data={formattedTeachers}
									cx="50%"
									cy="50%"
									labelLine={false}
									label={({ name, total_earned }) =>
										`${name}: $${(total_earned/100).toFixed(0)}`
									}
									outerRadius={80}
									fill="#000"
									dataKey="total_earned"
								>
									{formattedTeachers?.map((entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={COLORS[index % COLORS.length]}
											stroke="#fff"
											strokeWidth={2}
										/>
									))}
								</Pie>
								<Tooltip
									formatter={(value) => [`$${(value/100).toFixed(2)}`, 'Revenue']}
								/>
							</PieChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</div>
			
			{/* Tables Section */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Top Teachers Table */}
				<Card>
					<CardHeader>
						<CardTitle>Top Performing Teachers</CardTitle>
						<CardDescription>By sales and revenue</CardDescription>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Teacher</TableHead>
									<TableHead>Email</TableHead>
									<TableHead>Sales</TableHead>
									<TableHead className="text-right">Revenue</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{topTeachers?.map((teacher) => (
									<TableRow key={teacher.id}>
										<TableCell className="font-medium">
											{teacher?.name}
										</TableCell>
										<TableCell>{teacher?.email}</TableCell>
										<TableCell>
											<Badge variant="secondary">
												{teacher?.total_sales}
											</Badge>
										</TableCell>
										<TableCell className="text-right">
											${(teacher?.total_earned / 100).toLocaleString()}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
				
				{/* Top Students Table */}
				<Card>
					<CardHeader>
						<CardTitle>Top Students</CardTitle>
						<CardDescription>By purchases and spending</CardDescription>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Student</TableHead>
									<TableHead>Email</TableHead>
									<TableHead>Purchases</TableHead>
									<TableHead className="text-right">Spent</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{topStudents?.map((student) => (
									<TableRow key={student.id}>
										<TableCell className="font-medium">
											{student?.name}
										</TableCell>
										<TableCell>{student?.email}</TableCell>
										<TableCell>
											<Badge variant="secondary">
												{student?.total_purchases}
											</Badge>
										</TableCell>
										<TableCell className="text-right">
											${(student?.total_spent / 100).toLocaleString()}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>
			
			{/* All Courses Earnings Table */}
			<Card>
				<CardHeader>
					<CardTitle>All Courses Earnings</CardTitle>
					<CardDescription>Detailed revenue breakdown</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Course</TableHead>
								<TableHead>Teacher</TableHead>
								<TableHead>Sales</TableHead>
								<TableHead className="text-right">Revenue</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{earnings?.map((course) => (
								<TableRow key={course.course_id}>
									<TableCell className="font-medium">
										{course?.course_title}
									</TableCell>
									<TableCell>{course?.teacher_name}</TableCell>
									<TableCell>
										<Badge variant="secondary">
											{course?.total_sales}
										</Badge>
									</TableCell>
									<TableCell className="text-right">
										${(course?.total_earned / 100).toLocaleString()}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}

function StatCard({ title, value, description, icon }) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
				<span className="text-2xl">{icon}</span>
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{value}</div>
				<p className="text-xs text-muted-foreground">{description}</p>
			</CardContent>
		</Card>
	);
}