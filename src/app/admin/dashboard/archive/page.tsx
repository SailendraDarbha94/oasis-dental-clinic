"use client";
import React, { useEffect, useState } from "react";
import { database, auth } from "@/lib/firebase";
import { ref, onValue, off } from "firebase/database";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";

type Appointment = {
	id?: string;
	firebaseKey?: string;
	name: string;
	phone: string;
	age?: string;
	date: string;
	time: string;
	createdAt?: any;
	status?: string;
};

export default function ArchivePage() {
	const router = useRouter();

	const [user, setUser] = useState<User | null | undefined>(undefined);
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Listen for auth state changes and redirect unauthenticated users
	useEffect(() => {
		const unsub = onAuthStateChanged(auth, (u) => {
			setUser(u);
			if (!u) {
				router.replace("/");
			}
		});
		return () => unsub();
	}, [router]);

	// Load appointments only when the user is authenticated
	useEffect(() => {
		if (user === undefined) return; // still checking
		if (!user) return; // unauthenticated - we've already redirected

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
			const list: Appointment[] = Object.entries(val).map(([key, v]) => ({ firebaseKey: key, ...(v as any) }));
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
	}, [user]);

	function formatCreated(at: any) {
		if (!at) return "-";
		if (typeof at === "number") return new Date(at).toLocaleString();
		try {
			return new Date(at).toLocaleString();
		} catch {
			return String(at);
		}
	}

	// Filter only completed appointments
	const completedAppointments = appointments.filter((a) => a.status === "completed");

	return (
		<>
			<main className="min-h-screen bg-gray-50 p-8">
				<div className="max-w-5xl mx-auto">
					<h1 className="text-lg w-full mb-4 text-center md:text-3xl font-bold text-gray-900">Archive</h1>
					<div className="space-y-4">
						{loading ? (
							<div className="text-center py-12 text-gray-500">
								<p className="text-lg">Loading appointments...</p>
							</div>
						) : error ? (
							<div className="text-center py-12 text-red-500">
								<p className="text-lg">{error}</p>
							</div>
						) : completedAppointments.length === 0 ? (
							<div className="text-center py-12 text-gray-500">
								<p className="text-lg">No completed appointments yet.</p>
							</div>
						) : (
							completedAppointments.map((a) => (
								<div
									key={a.firebaseKey}
									className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 overflow-hidden"
								>
									<div className="p-6">
										<div className="flex items-start justify-between mb-4">
											<div className="flex-1">
												<h3 className="text-xl font-semibold text-gray-900 mb-1">{a.name}</h3>
												<p className="text-gray-600 text-sm">{a.phone}</p>
											</div>
											<div className="text-right">
												<div className="inline-block bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium">
													{a.date}
												</div>
											</div>
										</div>

										<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 py-4 border-y border-gray-100">
											<div>
												<p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Time</p>
												<p className="text-gray-900 font-medium mt-1">{a.time}</p>
											</div>
											<div>
												<p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Age</p>
												<p className="text-gray-900 font-medium mt-1">{a.age ?? "-"}</p>
											</div>
											<div>
												<p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Booked On</p>
												<p className="text-gray-900 font-medium mt-1 text-sm">{formatCreated(a.createdAt)}</p>
											</div>
											<div>
												<p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Status</p>
												<p className="text-gray-900 font-medium mt-1">
													<span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
														Completed
													</span>
												</p>
											</div>
										</div>
									</div>
								</div>
							))
						)}
					</div>
				</div>
			</main>
		</>
	);
}