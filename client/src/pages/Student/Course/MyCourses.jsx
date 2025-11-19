import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {getMyCoursesForStudent} from "@/features/dashboard/dashboardSlice.js";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {Progress} from "@radix-ui/react-progress";
import {
	PlayCircle,
	Clock,
	CheckCircle2,
	BarChart3,
	Eye,
	BookOpen
} from 'lucide-react';
import instance from "@/utils/axios.js";
import CourseSkeleton from "@/components/CourseSkeleton.jsx";

const MyCourses = () => {
	const dispatch = useDispatch();
	const { myCourses, loading } = useSelector(state => state.dashboard);
	
	useEffect(() => {
		dispatch(getMyCoursesForStudent());
	}, [dispatch]);
	
	const getProgressColor = (percent) => {
		if (percent === 100) return "bg-green-600";
		if (percent >= 75) return "bg-blue-600";
		if (percent >= 50) return "bg-blue-500";
		if (percent >= 25) return "bg-blue-400";
		return "bg-blue-300";
	};
	
	if (loading) {
		return <CourseSkeleton />;
	}
	
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mb-8 text-center">
					<h1 className="text-4xl font-bold text-slate-900 mb-3">
						Mening Kurslarim
					</h1>
					<p className="text-lg text-slate-600 max-w-2xl mx-auto">
						Sizning o'qiyotgan va yakunlagan kurslaringiz. Davom eting yoki qayta ko'rib chiqing.
					</p>
					<div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
						<BookOpen className="h-4 w-4 text-blue-600" />
						<span className="text-sm font-medium text-blue-700">
              {myCourses?.courses?.length} ta kurs
            </span>
					</div>
				</div>
				
				{/* Courses Grid */}
				{myCourses?.courses?.length === 0 ? (
					<EmptyState />
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
						{myCourses?.courses?.map((course) => (
							<CourseCard key={course.id} course={course} getProgressColor={getProgressColor} />
						))}
					</div>
				)}
			</div>
		</div>
	);
};

// Course Card Component
const CourseCard = ({ course, getProgressColor }) => {
	
	const lessonIds = Object.keys(course?.progress || {})
	
	return (
		<Card className="group hover:shadow-lg transition-all duration-300 border-slate-200 overflow-hidden">
			{/* Course Image */}
			<div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
				{course?.preview_image ? (
					<img
						src={instance.defaults.baseURL + course?.preview_image}
						alt={course?.title}
						className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
						<BookOpen className="h-12 w-12 text-blue-500 opacity-50" />
					</div>
				)}
				
				{/* Progress Badge */}
				<div className="absolute top-3 right-3">
					<Badge
						variant={course?.progress_percent === 100 ? "default" : "secondary"}
						className={`
              ${course?.progress_percent === 100
							? 'bg-green-100 text-green-800 hover:bg-green-100'
							: 'bg-blue-100 text-blue-800 hover:bg-blue-100'
						} font-semibold
            `}
					>
						{course?.progress_percent === 100 ? (
							<>
								<CheckCircle2 className="h-3 w-3 mr-1" />
								Yakunlangan
							</>
						) : (
							`${course?.progress_percent}%`
						)}
					</Badge>
				</div>
				
				{/* Overlay on hover */}
				<div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
			</div>
			
			<CardHeader className="pb-3">
				{/* Category */}
				{course?.category_name && (
					<Badge variant="outline" className="w-fit text-xs mb-2">
						{course?.category_name}
					</Badge>
				)}
				
				{/* Title */}
				<CardTitle className="text-lg leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
					{course?.title}
				</CardTitle>
				
				{/* Description */}
				<CardDescription className="line-clamp-2 mt-2">
					{course?.description}
				</CardDescription>
			</CardHeader>
			
			<CardContent>
				{/* Teacher */}
				<div className="flex items-center text-sm text-slate-600 mb-4">
					<div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
            <span className="text-xs font-medium text-blue-600">
              {course?.teacher_name?.charAt(0)}
            </span>
					</div>
					{course?.teacher_name}
				</div>
				
				{/* Progress Section */}
				<div className="space-y-2">
					<div className="flex justify-between text-sm">
						<span className="text-slate-600">Progress</span>
						<span className="font-medium text-slate-900">
              {course?.completed_lessons}/{course?.total_lessons} dars
            </span>
					</div>
					<Progress
						value={course?.progress_percent}
						className="h-2 bg-slate-200"
					>
						{/* Custom indicator for different colors */}
						<div
							className={`h-full transition-all duration-500 rounded-full ${getProgressColor(course?.progress_percent)}`}
							style={{
								width: `${course?.progress_percent}%`,
								// transform: `translateX(-${100 - course?.progress_percent}%)`
							}}
						/>
					</Progress>
				</div>
			</CardContent>
			
			<CardFooter className="pt-0 flex gap-2">
				{course?.progress_percent === 100 ? (
					<Button asChild className="flex-1" variant="outline">
						<Link to={`/student/${course?.id}/lessons/${lessonIds[0]}`}>
							<CheckCircle2 className="h-4 w-4 mr-2" />
							Qayta Ko'rish
						</Link>
					</Button>
				) : course?.progress_percent > 0 ? (
					<Button asChild className="flex-1">
						<Link to={`/student/${course?.id}/lessons/${lessonIds[0]}`}>
							<PlayCircle className="h-4 w-4 mr-2" />
							Davom Etish
						</Link>
					</Button>
				) : (
					<Button asChild className="flex-1">
						<Link to={`/student/${course?.id}/lessons`}>
							<PlayCircle className="h-4 w-4 mr-2" />
							Boshlash
						</Link>
					</Button>
				)}
				
				<Button asChild variant="outline" size="icon">
					<Link to={`/course/${course?.id}`}>
						<Eye className="h-4 w-4" />
					</Link>
				</Button>
			</CardFooter>
			
			{/* Enrollment Date */}
			<div className="px-6 pt-2 border-t border-slate-100">
				<div className="flex items-center text-xs text-slate-500">
					<Clock className="h-3 w-3 mr-1" />
					Yozilgan: {new Date(course?.enrolled_at).toLocaleDateString('uz-UZ')}
				</div>
			</div>
		</Card>
	);
};

// Empty State Component
const EmptyState = () => (
	<Card className="max-w-2xl mx-auto text-center border-dashed border-2 border-slate-300">
		<CardContent className="pt-12 pb-12">
			<div className="flex justify-center mb-4">
				<div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
					<BarChart3 className="h-10 w-10 text-blue-500" />
				</div>
			</div>
			<CardTitle className="text-xl mb-2">Hozircha kurslar yo'q</CardTitle>
			<CardDescription className="mb-6 max-w-md mx-auto">
				Siz hali hech qanday kurs sotib olmagansiz. Birinchi kursingizni sotib oling va o'qishni boshlang.
			</CardDescription>
			<Button asChild size="lg">
				<Link to="/courses">
					<BookOpen className="h-4 w-4 mr-2" />
					Kurslarni Ko'rish
				</Link>
			</Button>
		</CardContent>
	</Card>
);

export default MyCourses;