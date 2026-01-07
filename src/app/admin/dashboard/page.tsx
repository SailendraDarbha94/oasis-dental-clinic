"use client";
import React, { useEffect, useState } from "react";
import { database } from "@/lib/firebase";
import { ref, onValue, off, remove } from "firebase/database";
import Header from "@/components/Header";

type Appointment = {
	id?: string;
	name: string;
	phone: string;
	age?: string;
	date: string;
	time: string;
	createdAt?: any;
	status?: string;
};

export default function AdminPage() {
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [queryText, setQueryText] = useState("");

	useEffect(() => {
		setLoading(true);
		setError(null);
		const appointmentsRef = ref(database, "oasis/appointments");

		const handleSnapshot = (snap: any) => {
			const val = snap.val();
			if (!val) {
				setAppointments([]);
				setLoading(false);
				return;
			}
			const list: Appointment[] = Object.entries(val).map(([key, v]) => ({ id: key, ...(v as any) }));
			// sort by createdAt desc if available
			list.sort((a, b) => {
				const ta = a.createdAt ?? 0;
				const tb = b.createdAt ?? 0;
				return tb - ta;
			});
			setAppointments(list);
			setLoading(false);
		};

		onValue(appointmentsRef, handleSnapshot, (err) => {
			console.error("RTDB listen error", err);
			setError("Failed to load appointments");
			setLoading(false);
		});

		return () => {
			off(appointmentsRef, "value", handleSnapshot);
		};
	}, []);

	async function deleteOne(id?: string) {
		if (!id) return;
		if (!confirm("Delete this appointment?")) return;
		try {
			await remove(ref(database, `oasis/appointments/${id}`));
		} catch (err) {
			console.error("Failed to delete appointment", err);
			setError("Failed to delete appointment");
		}
	}

	function formatCreated(at: any) {
		if (!at) return "-";
		// RTDB serverTimestamp becomes a number (ms) once resolved
		if (typeof at === "number") return new Date(at).toLocaleString();
		try {
			return new Date(at).toLocaleString();
		} catch {
			return String(at);
		}
	}

	const filtered = appointments.filter((a) => {
		if (!queryText.trim()) return true;
		return a.name.toLowerCase().includes(queryText.toLowerCase()) || a.phone.includes(queryText);
	});

	return (
		<>
			<Header />
			<main className="min-h-screen bg-gray-50 p-8">
				<div className="max-w-6xl mx-auto">
					<div className="flex items-center justify-between mb-6">
						<h1 className="text-2xl font-bold text-gray-900">Admin — Appointments</h1>
						<div className="flex items-center gap-3">
							<input
								value={queryText}
								onChange={(e) => setQueryText(e.target.value)}
								placeholder="Search name or phone"
								className="px-3 py-2 rounded-md border border-gray-200"
							/>
							<button
								onClick={() => {
									setQueryText("");
								}}
								className="bg-gray-50 text-gray-700 px-4 py-2 rounded-md border border-gray-100 hover:bg-gray-100"
							>
								Clear
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
								{loading ? (
									<tr>
										<td colSpan={7} className="px-6 py-8 text-center text-gray-500">
											Loading appointments...
										</td>
									</tr>
								) : error ? (
									<tr>
										<td colSpan={7} className="px-6 py-8 text-center text-red-500">
											{error}
										</td>
									</tr>
								) : filtered.length === 0 ? (
									<tr>
										<td colSpan={7} className="px-6 py-8 text-center text-gray-500">
											No appointments yet.
										</td>
									</tr>
								) : (
									filtered.map((a) => (
										<tr key={a.id} className="border-t">
											<td className="px-6 py-4 align-top">
												<div className="font-medium text-gray-900">{a.name}</div>
											</td>
											<td className="px-6 py-4 align-top">{a.phone}</td>
											<td className="px-6 py-4 align-top">{a.age ?? "-"}</td>
											<td className="px-6 py-4 align-top">{a.date}</td>
											<td className="px-6 py-4 align-top">{a.time}</td>
											<td className="px-6 py-4 align-top text-sm text-gray-500">{formatCreated(a.createdAt)}</td>
											<td className="px-6 py-4 align-top">
												<button onClick={() => deleteOne(a.id)} className="text-sm text-red-600 hover:underline">
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
		</>
	);
}
