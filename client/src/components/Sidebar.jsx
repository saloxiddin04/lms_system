// import {Link, useLocation, useMatch} from "react-router-dom";
// import {cn} from "@/lib/utils";
// import {useEffect} from "react";
// import {useDispatch, useSelector} from "react-redux";
// import {getLessonById, getLessonsByCourseId} from "@/features/course/lessonSlice.js";
// import {getCourseById} from "@/features/course/courseSlice.js";
// import {CheckCircleIcon, PlayCircle} from "lucide-react";
//
// const menuItems = {
// 	student: [
// 		{to: "/student/dashboard", label: "Dashboard"},
// 		{to: "/student/my-courses", label: "My Courses"},
// 	],
// 	teacher: [
// 		{to: "/teacher/dashboard", label: "Dashboard"},
// 		{to: "/teacher/courses", label: "Manage Courses"},
// 	],
// 	admin: [
// 		{to: "/admin/dashboard", label: "Dashboard"},
// 		{to: "/admin/users", label: "Users"},
// 		{to: "/admin/courses", label: "Courses"},
// 		{to: "/admin/category", label: "Category"},
// 	],
// };
//
// export default function Sidebar({role}) {
// 	const dispatch = useDispatch()
// 	const {pathname} = useLocation();
// 	const items = menuItems[role] || [];
//
// 	const {lessons} = useSelector(state => state.lesson)
// 	const {course} = useSelector(state => state.course)
//
// 	const match = useMatch("/student/:courseId/lessons/:lessonId");
// 	const courseId = match?.params?.courseId;
// 	const lessonId = match?.params?.lessonId;
//
// 	useEffect(() => {
// 		const isLessonPage = pathname.includes("/student/") && pathname.includes("/lessons/");
// 		if (isLessonPage && courseId && lessonId) {
// 			dispatch(getCourseById({id: courseId}))
// 			dispatch(getLessonsByCourseId({courseId}))
// 			dispatch(getLessonById({id: lessonId}))
// 		}
// 	}, [courseId, lessonId, pathname]);
//
// 	const isLessonPage = pathname.includes("/student/") && pathname.includes("/lessons/");
//
// 	return (
// 		<aside className="fixed top-[56px] left-0 h-[calc(100vh-56px)] w-64 bg-white border-r p-2 z-40 overflow-y-auto">
// 			<nav className="flex flex-col gap-2 my-2">
// 				{isLessonPage && lessons?.length > 0 ? (
// 					<>
// 						<div className={"p-2 flex flex-col border-b"}>
// 							<h2 className="font-semibold text-center">{course?.title}</h2>
// 						</div>
// 						{lessons?.map((lesson) => (
// 							<Link
// 								key={lesson?.id}
// 								to={`/student/${courseId}/lessons/${lesson?.id}`}
// 								className={cn(
// 									"px-1 py-2 rounded-md text-sm font-medium truncate flex justify-between",
// 									pathname.endsWith(`/lessons/${lesson?.id}`)
// 										? "bg-blue-500 text-white"
// 										: "text-gray-700 hover:bg-gray-100"
// 								)}
// 							>
// 								<div className={"flex gap-2 items-center"}>
// 									<PlayCircle/>
// 									<span>{lesson?.title}</span>
// 								</div>
// 								{lesson?.is_completed && <CheckCircleIcon />}
// 							</Link>
// 						))}
// 					</>
// 				) : (
// 					items?.map((item) => (
// 						<Link
// 							key={item?.to}
// 							to={item?.to}
// 							className={cn(
// 								"px-3 py-2 rounded-md text-sm font-medium",
// 								location.pathname.startsWith(item?.to)
// 									? "bg-blue-500 text-white"
// 									: "text-gray-700 hover:bg-gray-100"
// 							)}
// 						>
// 							{item?.label}
// 						</Link>
// 					))
// 				)}
// 			</nav>
// 		</aside>
// 	);
// }

import {Link, useLocation, useMatch} from "react-router-dom";
import {cn} from "@/lib/utils";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getLessonById, getLessonsByCourseId} from "@/features/course/lessonSlice.js";
import {getCourseById} from "@/features/course/courseSlice.js";
import {CheckCircleIcon, PlayCircle} from "lucide-react";

const menuItems = {
	student: [
		{to: "/student/dashboard", label: "Dashboard"},
		{to: "/student/my-courses", label: "My Courses"},
		{to: "/student/profile", label: "Profile"},
	],
	teacher: [
		{to: "/teacher/dashboard", label: "Dashboard"},
		{to: "/teacher/courses", label: "Manage Courses"},
		{to: "/teacher/profile", label: "Profile"},
	],
	admin: [
		{to: "/admin/dashboard", label: "Dashboard"},
		{to: "/admin/users", label: "Users"},
		{to: "/admin/courses", label: "Courses"},
		{to: "/admin/category", label: "Category"},
		{to: "/admin/profile", label: "Profile"},
	],
};

export default function Sidebar({role}) {
	const dispatch = useDispatch()
	const {pathname} = useLocation();
	const items = menuItems[role] || [];
	
	const {lessons} = useSelector(state => state.lesson)
	const {course} = useSelector(state => state.course)
	
	const match = useMatch("/student/:courseId/lessons/:lessonId");
	const courseId = match?.params?.courseId;
	const lessonId = match?.params?.lessonId;
	
	useEffect(() => {
		const isLessonPage = pathname.includes("/student/") && pathname.includes("/lessons/");
		if (isLessonPage && courseId && lessonId) {
			dispatch(getCourseById({id: courseId}))
			dispatch(getLessonsByCourseId({courseId}))
			dispatch(getLessonById({id: lessonId}))
		}
	}, [courseId, lessonId, pathname]);
	
	const isLessonPage = pathname.includes("/student/") && pathname.includes("/lessons/");
	
	// Calculate progress - check both enrollment progress and lesson.is_completed
	const calculateProgress = () => {
		if (!lessons || lessons.length === 0) {
			return { percentage: 0, completed: 0, total: 0 };
		}
		
		// Use enrollment progress if available, otherwise count completed lessons
		let completedCount;
		if (course?.progress) {
			completedCount = Object.keys(course.progress).length;
		} else {
			completedCount = lessons.filter(lesson => lesson.is_completed).length;
		}
		
		const totalLessons = lessons.length;
		const percentage = Math.round((completedCount / totalLessons) * 100);
		
		return {
			percentage,
			completed: completedCount,
			total: totalLessons
		};
	};
	
	const progressData = calculateProgress();
	
	// Check if lesson is completed - check both sources
	const isLessonCompleted = (lessonId) => {
		if (course?.progress?.[lessonId]) {
			return true;
		}
		// Fallback to lesson's is_completed status
		const lesson = lessons.find(l => l.id === lessonId);
		return lesson?.is_completed || false;
	};
	
	return (
		<aside className="fixed top-[56px] left-0 h-[calc(100vh-56px)] w-64 bg-white border-r p-2 z-40 overflow-y-auto flex flex-col">
			<nav className="flex flex-col gap-2 my-4 flex-1">
				{isLessonPage && lessons?.length > 0 ? (
					<>
						<div className={"p-2 flex flex-col border-b"}>
							<h2 className="font-semibold text-center">{course?.title}</h2>
						</div>
						{lessons?.map((lesson) => (
							<Link
								key={lesson?.id}
								to={`/student/${courseId}/lessons/${lesson?.id}`}
								className={cn(
									"px-1 py-2 rounded-md text-sm font-medium truncate flex justify-between items-center",
									pathname.endsWith(`/lessons/${lesson?.id}`)
										? "bg-blue-500 text-white"
										: "text-gray-700 hover:bg-gray-100"
								)}
							>
								<div className={"flex gap-2 items-center flex-1 min-w-0"}>
									<PlayCircle className="w-4 h-4 flex-shrink-0"/>
									<span className="truncate">
										{lesson.order_index + 1}. {lesson?.title}
									</span>
								</div>
								{isLessonCompleted(lesson.id) && (
									<CheckCircleIcon className="w-4 h-4 flex-shrink-0 text-green-500" />
								)}
							</Link>
						))}
					</>
				) : (
					items?.map((item) => (
						<Link
							key={item?.to}
							to={item?.to}
							className={cn(
								"px-3 py-2 rounded-md text-sm font-medium",
								location.pathname.startsWith(item?.to)
									? "bg-blue-500 text-white"
									: "text-gray-700 hover:bg-gray-100"
							)}
						>
							{item?.label}
						</Link>
					))
				)}
			</nav>
			
			{/* Progress Section */}
			{isLessonPage && lessons?.length > 0 && (
				<div className="mt-auto p-4 border-t border-gray-200 bg-gray-50 rounded-lg">
					<div className="flex justify-between items-center mb-3">
						<span className="text-sm font-semibold text-gray-800">Course Progress</span>
						<span className="text-sm font-bold text-blue-600">{progressData.percentage}%</span>
					</div>
					
					{/* Progress Bar */}
					<div className="w-full bg-gray-300 rounded-full h-3 mb-2">
						<div
							className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
							style={{ width: `${progressData.percentage}%` }}
						></div>
					</div>
					
					{/* Progress Details */}
					<div className="flex justify-between items-center">
						<span className="text-xs text-gray-600">
							{progressData.completed}/{progressData.total} lessons
						</span>
						
						{progressData.percentage === 100 ? (
							<span className="text-xs text-green-600 font-medium flex items-center bg-green-50 px-2 py-1 rounded-full">
								<CheckCircleIcon className="w-3 h-3 mr-1" />
								Course Completed
							</span>
						) : progressData.percentage > 0 ? (
							<span className="text-xs text-blue-600 font-medium">
								In Progress
							</span>
						) : (
							<span className="text-xs text-gray-500 font-medium">
								Not Started
							</span>
						)}
					</div>
				</div>
			)}
		</aside>
	);
}