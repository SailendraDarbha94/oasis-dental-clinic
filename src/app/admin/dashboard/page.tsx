"use client";
import React, { useEffect, useState } from "react";
import { database, auth } from "@/lib/firebase";
import { ref, onValue, off, remove, update } from "firebase/database";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import ConfirmModal from "@/components/ConfirmModal";
import WeatherCard from "@/components/WeatherCard";

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
	service?: string;
};

export default function AdminPage() {
	const router = useRouter();

	// undefined = checking, null = unauthenticated, User = authenticated
	const [user, setUser] = useState<User | null | undefined>(undefined);

	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [queryText, setQueryText] = useState("");

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
			console.log("Raw appointments data", val);
			const list: Appointment[] = Object.entries(val).map(([key, v]) => ({ firebaseKey: key, ...(v as any) }));
			// sort by createdAt desc if available
			list.sort((a, b) => {
				const ta = a.createdAt ?? 0;
				const tb = b.createdAt ?? 0;
				return tb - ta;
			});
			setAppointments(list);
			console.log("Loaded appointments", list);
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

	async function deleteOne(firebaseKey?: string) {
		if (!firebaseKey) return;
		try {
			console.log("Deleting appointment", firebaseKey);
			await remove(ref(database, `oasis/appointments/${firebaseKey}`));
		} catch (err) {
			console.error("Failed to delete appointment", err);
			setError("Failed to delete appointment");
		}
	}

	async function markAsCompleted(firebaseKey?: string) {
		if (!firebaseKey) return;
		try {
			console.log("Marking appointment as completed", firebaseKey);
			await update(ref(database, `oasis/appointments/${firebaseKey}`), { status: "completed" });
		} catch (err) {
			console.error("Failed to mark appointment as completed", err);
			setError("Failed to mark appointment as completed");
		}
	}

	const [confirmOpen, setConfirmOpen] = useState(false);
	const [pendingDeleteKey, setPendingDeleteKey] = useState<string | null>(null);
	const [pendingDeleteName, setPendingDeleteName] = useState<string | null>(null);

	function showDeleteConfirm(key?: string, name?: string) {
		if (!key) return;
		setPendingDeleteKey(key);
		setPendingDeleteName(name ?? null);
		setConfirmOpen(true);
	}

	async function handleConfirmDelete() {
		if (!pendingDeleteKey) return;
		await deleteOne(pendingDeleteKey);
		setPendingDeleteKey(null);
		setPendingDeleteName(null);
		setConfirmOpen(false);
	}

	function handleCancelDelete() {
		setPendingDeleteKey(null);
		setPendingDeleteName(null);
		setConfirmOpen(false);
	}

	async function logout() {
		try {
			await signOut(auth);
			router.replace("/");
		} catch (err) {
			console.error("Sign out failed", err);
			setError("Failed to sign out");
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
		if (a.status === "completed") return false;
		if (!queryText.trim()) return true;
		return a.name.toLowerCase().includes(queryText.toLowerCase()) || a.phone.includes(queryText);
	});

	return (
		<>
			<Header />
			<main className="min-h-screen bg-gray-50 p-8">
				<div className="max-w-5xl mx-auto">
					<h1 className="text-lg w-full mb-4 text-center md:text-3xl font-bold text-gray-900">Appointments</h1>
					<div className="flex items-center justify-between mb-8 max-w-full">


						<div className="flex items-center gap-3">
							<input
								value={queryText}
								onChange={(e) => setQueryText(e.target.value)}
								placeholder="Search name or phone"
								className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
							/>
							<button
								onClick={() => {
									setQueryText("");
								}}
								className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
							>
								Clear
							</button>


						</div>
					</div>
					<div className="flex justify-center">
						<button
							onClick={logout}
							className="bg-red-600 mr-2 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
						>
							Logout
						</button>
						<button
							onClick={() => router.push("/admin/dashboard/archive")}
							className="bg-blue-600 ml-2 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
						>
							Archive
						</button>
						{/* <button
							onClick={() => router.push("/admin/dashboard/billing")}
							className="bg-green-600 ml-2 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
						>
							Billing
						</button> */}
					</div>
					<div id='weather' className="bg-gradient-to-br from-teal-50 to-blue-50 py-4">
						<WeatherCard />
					</div>
					<div className="space-y-4">
						{loading ? (
							<div className="text-center py-12 text-gray-500">
								<p className="text-lg">Loading appointments...</p>
							</div>
						) : error ? (
							<div className="text-center py-12 text-red-500">
								<p className="text-lg">{error}</p>
							</div>
						) : filtered.length === 0 ? (
							<div className="text-center py-12 text-gray-500">
								<p className="text-lg">No appointments yet.</p>
							</div>
						) : (
							filtered.map((a) => (
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
												<p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Service</p>
												<p className="text-gray-900 font-medium mt-1">{a.service}</p>
												{/* {a.status === "completed" ? (
														<span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
															Completed
														</span>
													) : (
														<span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
															Pending
														</span>
													)}
												</p> */}
											</div>
										</div>

										<div className="flex gap-3 justify-end">
											<button
												onClick={() => markAsCompleted(a.firebaseKey)}
												className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
											>
												Mark Completed
											</button>
											<button
												onClick={() => showDeleteConfirm(a.firebaseKey, a.name)}
												className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors font-medium text-sm"
											>
												Delete
											</button>
										</div>
									</div>
								</div>
							))
						)}
					</div>
					<ConfirmModal
						open={confirmOpen}
						title="Delete appointment"
						description={pendingDeleteName ? `Delete appointment for ${pendingDeleteName}? This action cannot be undone.` : "Delete this appointment? This action cannot be undone."}
						onConfirm={handleConfirmDelete}
						onCancel={handleCancelDelete}
						confirmLabel="Delete"
						cancelLabel="Cancel"
					/>
				</div>
			</main>
		</>
	);
}
