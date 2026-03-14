"use client";
import React, { useEffect, useState } from "react";
import { database, auth } from "@/lib/firebase";
import { ref, onValue, off, remove } from "firebase/database";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/components/ConfirmModal";
import type { BillRecord } from "@/lib/firebase";

export default function BillingPage() {
	const router = useRouter();
	const [user, setUser] = useState<User | null | undefined>(undefined);
	const [bills, setBills] = useState<BillRecord[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [pendingDeleteKey, setPendingDeleteKey] = useState<string | null>(null);
	const [pendingDeleteName, setPendingDeleteName] = useState<string | null>(null);

	useEffect(() => {
		const unsub = onAuthStateChanged(auth, (u) => {
			setUser(u);
			if (!u) router.replace("/");
		});
		return () => unsub();
	}, [router]);

	useEffect(() => {
		if (user === undefined) return;
		if (!user) return;

		setLoading(true);
		setError(null);
		const billsRef = ref(database, "oasis/bills");

		const handleSnapshot = (snap: any) => {
			const val = snap.val();
			if (!val) {
				setBills([]);
				setLoading(false);
				return;
			}
			const list: BillRecord[] = Object.entries(val).map(([key, v]) => ({
				firebaseKey: key,
				...(v as any),
			}));
			list.sort((a, b) => {
				const ta = a.createdAt ?? 0;
				const tb = b.createdAt ?? 0;
				return tb - ta;
			});
			setBills(list);
			setLoading(false);
		};

		onValue(billsRef, handleSnapshot, () => {
			setError("Failed to load bills");
			setLoading(false);
		});

		return () => {
			off(billsRef, "value", handleSnapshot);
		};
	}, [user]);

	const fmt = (n: number) =>
		`₹ ${n.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

	function showDeleteConfirm(key?: string, name?: string) {
		if (!key) return;
		setPendingDeleteKey(key);
		setPendingDeleteName(name ?? null);
		setConfirmOpen(true);
	}

	async function handleConfirmDelete() {
		if (!pendingDeleteKey) return;
		try {
			await remove(ref(database, `oasis/bills/${pendingDeleteKey}`));
		} catch (err) {
			console.error("Failed to delete bill", err);
			setError("Failed to delete bill");
		}
		setPendingDeleteKey(null);
		setPendingDeleteName(null);
		setConfirmOpen(false);
	}

	function handleCancelDelete() {
		setPendingDeleteKey(null);
		setPendingDeleteName(null);
		setConfirmOpen(false);
	}

	function formatDate(at: any) {
		if (!at) return "-";
		if (typeof at === "number") return new Date(at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
		try {
			return new Date(at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
		} catch {
			return String(at);
		}
	}

	return (
		<main className="min-h-screen bg-gray-50 p-8">
			<div className="max-w-5xl mx-auto">
				{/* Header */}
				<div className="flex items-center justify-between mb-8">
					<h1 className="text-lg md:text-3xl font-bold text-gray-900">Billing</h1>
					<button
						onClick={() => router.push("/admin/dashboard/billing/new")}
						className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors shadow-sm"
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
							<path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
						</svg>
						Generate Bill
					</button>
				</div>

				{/* Content */}
				{loading ? (
					<div className="text-center py-20 text-gray-500">
						<p className="text-lg">Loading bills...</p>
					</div>
				) : error ? (
					<div className="text-center py-20 text-red-500">
						<p className="text-lg">{error}</p>
					</div>
				) : bills.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-24 text-center">
						<div className="bg-teal-50 rounded-full p-6 mb-6">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
								<path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
							</svg>
						</div>
						<h2 className="text-xl font-semibold text-gray-700 mb-2">No bills generated yet</h2>
						<p className="text-gray-500 mb-6 max-w-md">
							Bills you generate will appear here. Click the button below to create your first invoice.
						</p>
						<button
							onClick={() => router.push("/admin/dashboard/billing/new")}
							className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors shadow-sm"
						>
							Generate Your First Bill
						</button>
					</div>
				) : (
					<div className="space-y-4">
						{bills.map((b) => (
							<div
								key={b.firebaseKey}
								className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 overflow-hidden"
							>
								<div className="p-6">
									<div className="flex items-start justify-between mb-4">
										<div className="flex-1">
											<h3 className="text-xl font-semibold text-gray-900 mb-1">{b.patientName}</h3>
											<p className="text-gray-500 text-sm font-mono">{b.invoiceNumber}</p>
										</div>
										<div className="text-right">
											<div className="inline-block bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium">
												{formatDate(b.createdAt)}
											</div>
										</div>
									</div>

									<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 py-4 border-y border-gray-100">
										<div>
											<p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Phone</p>
											<p className="text-gray-900 font-medium mt-1">{b.phone}</p>
										</div>
										<div>
											<p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Service</p>
											<p className="text-gray-900 font-medium mt-1">{b.service}</p>
										</div>
										<div>
											<p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Amount</p>
											<p className="text-gray-900 font-medium mt-1">{fmt(b.amount)}</p>
										</div>
										<div>
											<p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Total</p>
											<p className="text-teal-700 font-bold mt-1 text-lg">{fmt(b.total)}</p>
										</div>
									</div>

									<div className="flex gap-3 justify-end">
										{b.storageUrl && (
											<a
												href={b.storageUrl}
												target="_blank"
												rel="noopener noreferrer"
												className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium text-sm"
											>
												<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
													<path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
												</svg>
												View / Download
											</a>
										)}
										<button
											onClick={() => showDeleteConfirm(b.firebaseKey, b.patientName)}
											className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors font-medium text-sm"
										>
											<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
												<path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
											</svg>
											Delete
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
				<ConfirmModal
					open={confirmOpen}
					title="Delete bill"
					description={pendingDeleteName ? `Delete bill for ${pendingDeleteName}? This action cannot be undone.` : "Delete this bill? This action cannot be undone."}
					onConfirm={handleConfirmDelete}
					onCancel={handleCancelDelete}
					confirmLabel="Delete"
					cancelLabel="Cancel"
				/>
			</div>
		</main>
	);
}