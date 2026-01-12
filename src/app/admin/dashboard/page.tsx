"use client";
import React, { useEffect, useState } from "react";
import { database, auth } from "@/lib/firebase";
import { ref, onValue, off, remove } from "firebase/database";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import ConfirmModal from "@/components/ConfirmModal";

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
							<button
								onClick={logout}
								className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
							>
								Logout
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
										<tr key={a.firebaseKey} className="border-t">
											<td className="px-6 py-4 align-top">
												<div className="font-medium text-gray-900">{a.name}</div>
											</td>
											<td className="px-6 py-4 align-top">{a.phone}</td>
											<td className="px-6 py-4 align-top">{a.age ?? "-"}</td>
											<td className="px-6 py-4 align-top">{a.date}</td>
											<td className="px-6 py-4 align-top">{a.time}</td>
											<td className="px-6 py-4 align-top text-sm text-gray-500">{formatCreated(a.createdAt)}</td>
											<td className="px-6 py-4 align-top">
												<button onClick={() => showDeleteConfirm(a.firebaseKey, a.name)} className="text-sm text-red-600 hover:underline">
													Delete
												</button>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
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
