import {Navigate} from "react-router-dom";
import {getUserData} from "@/auth/jwtService.js";

export default function ProtectedRoute({ roles, children }) {
	if (!getUserData()) {
		return <Navigate to="/login" replace />;
	}
	if (roles && !roles.includes(getUserData()?.role)) {
		return <Navigate to="/403" replace />;
	}
	return children;
}
