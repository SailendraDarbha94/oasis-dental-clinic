"use client";
import React, { useEffect, useState } from "react";

type Appointment = {
	id?: string;
	name: string;
	phone: string;
	age: string;
	date: string;
	time: string;
	createdAt?: string;
};

const STORAGE_KEY = "oasis_appointments";

export default function AdminPage() {
	const [appointments, setAppointments] = useState<Appointment[]>([]);

	useEffect(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY) || "[]";
			const arr: Appointment[] = JSON.parse(raw);
			setAppointments(arr);
		} catch (err) {
			console.error(err);
		}
	}, []);

	function removeOne(id?: string) {
		if (!id) return;
		const filtered = appointments.filter((a) => a.id !== id);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
		setAppointments(filtered);
	}

	function clearAll() {
		if (!confirm("Clear all appointments?")) return;
		localStorage.removeItem(STORAGE_KEY);
		setAppointments([]);
	}

	return (
		<main className="min-h-screen bg-gray-50 p-8">
			<div className="max-w-6xl mx-auto">
				<div className="flex items-center justify-between mb-6">
					<h1 className="text-2xl font-bold text-gray-900">Admin — Appointments</h1>
					<div className="flex items-center gap-3">
						<button
							onClick={clearAll}
							className="bg-red-50 text-red-700 px-4 py-2 rounded-md border border-red-100 hover:bg-red-100"
						>
							Clear All
						</button>
					</div>
				</div>

				<div className="bg-white rounded-2xl shadow overflow-hidden">
					<table className="w-full text-left">
						<thead className="bg-teal-50">
							<tr>
								<th className="px-6 py-3 text-sm font-medium text-gray-600">Name</th>
								<th className="px-6 py-3 text-sm font-medium text-gray-600">Phone</th>
								<th className="px-6 py-3 text-sm font-medium text-gray-600">Age</th>
								<th className="px-6 py-3 text-sm font-medium text-gray-600">Date</th>
								<th className="px-6 py-3 text-sm font-medium text-gray-600">Time</th>
								<th className="px-6 py-3 text-sm font-medium text-gray-600">Created</th>
								<th className="px-6 py-3 text-sm font-medium text-gray-600">Actions</th>
							</tr>
						</thead>
						<tbody>
							{appointments.length === 0 ? (
								<tr>
									<td colSpan={7} className="px-6 py-8 text-center text-gray-500">
										No appointments yet.
									</td>
								</tr>
							) : (
								appointments.map((a) => (
									<tr key={a.id} className="border-t">
										<td className="px-6 py-4 align-top">
											<div className="font-medium text-gray-900">{a.name}</div>
										</td>
										<td className="px-6 py-4 align-top">{a.phone}</td>
										<td className="px-6 py-4 align-top">{a.age}</td>
										<td className="px-6 py-4 align-top">{a.date}</td>
										<td className="px-6 py-4 align-top">{a.time}</td>
										<td className="px-6 py-4 align-top text-sm text-gray-500">
											{a.createdAt ? new Date(a.createdAt).toLocaleString() : "-"}
										</td>
										<td className="px-6 py-4 align-top">
											<button
												onClick={() => removeOne(a.id)}
												className="text-sm text-red-600 hover:underline"
											>
												Delete
											</button>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>
		</main>
	);
}
