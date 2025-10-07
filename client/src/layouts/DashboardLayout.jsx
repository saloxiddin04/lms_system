import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { getUserData } from "@/auth/jwtService.js";
import React from "react";

export default function DashboardLayout({ children }) {
	return (
		<div className="h-screen">
			<Navbar />
			<Sidebar role={getUserData()?.role} />
			<main className="pt-[56px] pl-64 h-full bg-gray-50 p-6 overflow-y-auto">
				{children}
			</main>
		</div>
	);
}
