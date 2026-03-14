import React from "react";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen bg-gray-50">
			<AdminSidebar />
			<div className="md:ml-64">
				{children}
			</div>
		</div>
	);
}
