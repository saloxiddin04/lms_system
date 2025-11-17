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
	],
	teacher: [
		{to: "/teacher/dashboard", label: "Dashboard"},
		{to: "/teacher/courses", label: "Manage Courses"},
	],
	admin: [
		{to: "/admin/dashboard", label: "Dashboard"},
		{to: "/admin/users", label: "Users"},
		{to: "/admin/courses", label: "Courses"},
		{to: "/admin/category", label: "Category"},
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
	
	return (
		<aside className="fixed top-[56px] left-0 h-[calc(100vh-56px)] w-64 bg-white border-r p-4 z-40 overflow-y-auto">
			<nav className="flex flex-col gap-2 my-2">
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
									"px-3 py-2 rounded-md text-sm font-medium truncate flex justify-between",
									pathname.endsWith(`/lessons/${lesson?.id}`)
										? "bg-blue-500 text-white"
										: "text-gray-700 hover:bg-gray-100"
								)}
							>
								<div className={"flex gap-2 items-center"}>
									<PlayCircle/>
									<span>{lesson?.title}</span>
								</div>
								{lesson?.is_completed && <CheckCircleIcon />}
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
		</aside>
	);
}
