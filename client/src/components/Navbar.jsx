import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getUserData, logout } from "@/auth/jwtService.js";

export default function Navbar() {
	const navigate = useNavigate();
	
	return (
		<nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm px-6 py-3 flex items-center justify-between">
			<Link to="/" className="text-xl font-bold">
				Online LMS
			</Link>
			<div className="flex items-center gap-4">
				{getUserData() ? (
					<>
            <span className="text-sm text-gray-600">
              Hi, {getUserData()?.name}
            </span>
						{getUserData()?.role === "admin" && (
							<Button onClick={() => navigate("/admin/dashboard")}>
								Admin mode
							</Button>
						)}
						{getUserData()?.role === "teacher" && (
							<Button onClick={() => navigate("/teacher/dashboard")}>
								Teacher mode
							</Button>
						)}
						<Button variant="outline" onClick={logout}>
							Logout
						</Button>
					</>
				) : (
					<div className="flex gap-1">
						<Link to="/login">
							<Button>Login</Button>
						</Link>
						<Link to="/register">
							<Button variant={"outline"}>Register</Button>
						</Link>
					</div>
				)}
			</div>
		</nav>
	);
}
