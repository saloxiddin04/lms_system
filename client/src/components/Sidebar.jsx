import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const menuItems = {
	student: [
		{ to: "/student/dashboard", label: "Dashboard" },
		{ to: "/student/courses", label: "My Courses" },
	],
	teacher: [
		{ to: "/teacher/dashboard", label: "Dashboard" },
		{ to: "/teacher/courses", label: "Manage Courses" },
		{ to: "/teacher/students", label: "Students" },
	],
	admin: [
		{ to: "/admin/dashboard", label: "Dashboard" },
		{ to: "/admin/users", label: "Users" },
		{ to: "/admin/courses", label: "Courses" },
		{ to: "/admin/lessons", label: "Lessons" },
		{ to: "/admin/category", label: "Category" },
	],
};

export default function Sidebar({ role }) {
	const location = useLocation();
	const items = menuItems[role] || [];
	
	return (
		<aside className="fixed top-[56px] left-0 h-[calc(100vh-56px)] w-64 bg-white border-r p-4 z-40">
			<nav className="flex flex-col gap-2">
				{items.map((item) => (
					<Link
						key={item.to}
						to={item.to}
						className={cn(
							"px-3 py-2 rounded-md text-sm font-medium",
							location.pathname.startsWith(item.to)
								? "bg-blue-500 text-white"
								: "text-gray-700 hover:bg-gray-100"
						)}
					>
						{item.label}
					</Link>
				))}
			</nav>
		</aside>
	);
}
