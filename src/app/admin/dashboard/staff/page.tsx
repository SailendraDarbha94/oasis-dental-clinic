"use client";
import React, { useEffect, useState } from "react";
import { database, auth, saveStaffToRTDB, uploadStaffPhoto } from "@/lib/firebase";
import { ref, onValue, off, remove } from "firebase/database";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/toastContext";
import ConfirmModal from "@/components/ConfirmModal";
import type { StaffRecord } from "@/lib/firebase";

type StaffForm = {
	name: string;
	age: string;
	qualification: string;
	phone: string;
	email: string;
	role: string;
};

export default function StaffPage() {
	const router = useRouter();
	const { toast } = useToast();
	const [user, setUser] = useState<User | null | undefined>(undefined);
	const [staff, setStaff] = useState<StaffRecord[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Form state
	const [showForm, setShowForm] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [phoneError, setPhoneError] = useState<string | null>(null);
	const [emailError, setEmailError] = useState<string | null>(null);
	const [photoFile, setPhotoFile] = useState<File | null>(null);
	const [photoPreview, setPhotoPreview] = useState<string | null>(null);
	const [form, setForm] = useState<StaffForm>({
		name: "",
		age: "",
		qualification: "",
		phone: "",
		email: "",
		role: "",
	});

	// Delete state
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
		const staffRef = ref(database, "oasis/staff");

		const handleSnapshot = (snap: any) => {
			const val = snap.val();
			if (!val) {
				setStaff([]);
				setLoading(false);
				return;
			}
			const list: StaffRecord[] = Object.entries(val).map(([key, v]) => ({
				firebaseKey: key,
				...(v as any),
			}));
			list.sort((a, b) => {
				const ta = a.createdAt ?? 0;
				const tb = b.createdAt ?? 0;
				return tb - ta;
			});
			setStaff(list);
			setLoading(false);
		};

		onValue(staffRef, handleSnapshot, () => {
			setError("Failed to load staff data");
			setLoading(false);
		});

		return () => {
			off(staffRef, "value", handleSnapshot);
		};
	}, [user]);

	function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
		const { name, value } = e.target;
		if (name === "phone") {
			const digits = value.replace(/\D/g, "").slice(0, 10);
			setForm((s) => ({ ...s, phone: digits }));
			if (phoneError) setPhoneError(null);
			return;
		}
		if (name === "email") {
			setForm((s) => ({ ...s, email: value }));
			if (emailError) setEmailError(null);
			return;
		}
		setForm((s) => ({ ...s, [name]: value }));
	}

	function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;
		if (!file.type.startsWith("image/")) {
			toast({ message: "Please select an image file.", type: "error" });
			return;
		}
		if (file.size > 5 * 1024 * 1024) {
			toast({ message: "Image must be under 5 MB.", type: "error" });
			return;
		}
		setPhotoFile(file);
		setPhotoPreview(URL.createObjectURL(file));
	}

	function resetForm() {
		setForm({ name: "", age: "", qualification: "", phone: "", email: "", role: "" });
		setPhotoFile(null);
		if (photoPreview) URL.revokeObjectURL(photoPreview);
		setPhotoPreview(null);
		setPhoneError(null);
		setEmailError(null);
	}

	function isValidEmail(email: string) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		const required: (keyof StaffForm)[] = ["name", "age", "qualification", "phone", "email", "role"];
		const missing = required.filter((k) => !form[k].trim());
		if (missing.length) {
			toast({ message: "Please fill all required fields.", type: "error" });
			return;
		}

		if (!/^\d{10}$/.test(form.phone)) {
			setPhoneError("Phone number must be exactly 10 digits");
			toast({ message: "Phone number must be exactly 10 digits.", type: "error" });
			return;
		}

		if (!isValidEmail(form.email)) {
			setEmailError("Please enter a valid email address");
			toast({ message: "Please enter a valid email address.", type: "error" });
			return;
		}

		setSubmitting(true);

		try {
			let photoUrl = "";
			if (photoFile) {
				const ext = photoFile.name.split(".").pop() ?? "jpg";
				const fileName = `${Date.now()}-${form.name.replace(/\s+/g, "_")}.${ext}`;
				photoUrl = await uploadStaffPhoto(fileName, photoFile);
			}

			await saveStaffToRTDB({
				name: form.name,
				age: form.age,
				qualification: form.qualification,
				phone: form.phone,
				email: form.email,
				role: form.role,
				photoUrl,
			});

			toast({ message: "Staff member added successfully!", type: "success" });
			resetForm();
			setShowForm(false);
		} catch (err) {
			console.error("Failed to add staff", err);
			toast({ message: "Failed to add staff member. Please try again.", type: "error" });
		} finally {
			setSubmitting(false);
		}
	}

	function showDeleteConfirm(key?: string, name?: string) {
		if (!key) return;
		setPendingDeleteKey(key);
		setPendingDeleteName(name ?? null);
		setConfirmOpen(true);
	}

	async function handleConfirmDelete() {
		if (!pendingDeleteKey) return;
		try {
			await remove(ref(database, `oasis/staff/${pendingDeleteKey}`));
			toast({ message: "Staff member removed.", type: "success" });
		} catch (err) {
			console.error("Failed to delete staff", err);
			setError("Failed to delete staff member");
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

	return (
		<main className="min-h-screen bg-gray-50 p-4 md:p-8">
			<div className="max-w-5xl mx-auto">
				{/* Header */}
				<div className="flex items-center justify-between mb-8">
					<h1 className="text-lg md:text-3xl font-bold text-gray-900">Staff</h1>
					<button
						onClick={() => {
							resetForm();
							setShowForm((v) => !v);
						}}
						className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors shadow-sm"
					>
						{showForm ? (
							<>
								<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
									<path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
								</svg>
								Cancel
							</>
						) : (
							<>
								<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
									<path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
								</svg>
								Add Staff
							</>
						)}
					</button>
				</div>

				{/* Add Staff Form */}
				{showForm && (
					<form
						onSubmit={handleSubmit}
						noValidate
						className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden mb-8"
					>
						<div className="p-6 md:p-8 border-b border-gray-100">
							<h2 className="text-sm font-bold text-teal-700 uppercase tracking-wider mb-5">New Staff Member</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Full Name <span className="text-red-500">*</span>
									</label>
									<input
										name="name"
										type="text"
										required
										value={form.name}
										onChange={handleChange}
										placeholder="Full name"
										className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Age <span className="text-red-500">*</span>
									</label>
									<input
										name="age"
										type="number"
										min={18}
										required
										value={form.age}
										onChange={handleChange}
										placeholder="Age"
										className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Phone <span className="text-red-500">*</span>
									</label>
									<input
										name="phone"
										type="tel"
										inputMode="numeric"
										required
										value={form.phone}
										onChange={handleChange}
										placeholder="10 digit phone number"
										className={`w-full rounded-lg border px-4 py-2.5 focus:outline-none focus:ring-2 ${
											phoneError ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-teal-500 focus:border-transparent"
										}`}
									/>
									{phoneError && <p className="mt-1 text-sm text-red-600">{phoneError}</p>}
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Email <span className="text-red-500">*</span>
									</label>
									<input
										name="email"
										type="email"
										required
										value={form.email}
										onChange={handleChange}
										placeholder="Email address"
										className={`w-full rounded-lg border px-4 py-2.5 focus:outline-none focus:ring-2 ${
											emailError ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-teal-500 focus:border-transparent"
										}`}
									/>
									{emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Role <span className="text-red-500">*</span>
									</label>
									<select
										name="role"
										required
										value={form.role}
										onChange={handleChange}
										className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
									>
										<option value="">Select role</option>
										<option value="Dentist">Dentist</option>
										<option value="Orthodontist">Orthodontist</option>
										<option value="Oral Surgeon">Oral Surgeon</option>
										<option value="Hygienist">Hygienist</option>
										<option value="Dental Assistant">Dental Assistant</option>
										<option value="Receptionist">Receptionist</option>
										<option value="Lab Technician">Lab Technician</option>
										<option value="Other">Other</option>
									</select>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Educational Qualification <span className="text-red-500">*</span>
									</label>
									<input
										name="qualification"
										type="text"
										required
										value={form.qualification}
										onChange={handleChange}
										placeholder="e.g. BDS, MDS Orthodontics"
										className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
									/>
								</div>
							</div>
						</div>

						{/* Photo upload */}
						<div className="p-6 md:p-8 border-b border-gray-100">
							<h2 className="text-sm font-bold text-teal-700 uppercase tracking-wider mb-5">Photo</h2>
							<div className="flex items-center gap-6">
								{photoPreview ? (
									<img
										src={photoPreview}
										alt="Preview"
										className="w-20 h-20 rounded-full object-cover border-2 border-teal-200"
									/>
								) : (
									<div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
										<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
											<path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
										</svg>
									</div>
								)}
								<div>
									<label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors">
										<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
											<path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
										</svg>
										{photoFile ? "Change Photo" : "Upload Photo"}
										<input
											type="file"
											accept="image/*"
											onChange={handlePhotoChange}
											className="hidden"
										/>
									</label>
									<p className="text-xs text-gray-500 mt-1">Max 5 MB. JPG, PNG or WebP.</p>
								</div>
							</div>
						</div>

						{/* Submit */}
						<div className="p-6 md:p-8 bg-gray-50 flex flex-col sm:flex-row items-center justify-end gap-3">
							<button
								type="button"
								onClick={() => {
									resetForm();
									setShowForm(false);
								}}
								className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors text-sm"
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={submitting}
								className={`w-full sm:w-auto px-8 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold transition-colors text-sm shadow-sm ${
									submitting ? "opacity-60 cursor-not-allowed" : ""
								}`}
							>
								{submitting ? "Saving..." : "Add Staff"}
							</button>
						</div>
					</form>
				)}

				{/* Staff listing */}
				{loading ? (
					<div className="text-center py-20 text-gray-500">
						<p className="text-lg">Loading staff...</p>
					</div>
				) : error ? (
					<div className="text-center py-20 text-red-500">
						<p className="text-lg">{error}</p>
					</div>
				) : staff.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-24 text-center">
						<div className="bg-teal-50 rounded-full p-6 mb-6">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
								<path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
							</svg>
						</div>
						<h2 className="text-xl font-semibold text-gray-700 mb-2">No staff members yet</h2>
						<p className="text-gray-500 mb-6 max-w-md">
							Add your clinic&apos;s team members. Click the button above to get started.
						</p>
						<button
							onClick={() => setShowForm(true)}
							className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors shadow-sm"
						>
							Add Your First Staff Member
						</button>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{staff.map((s) => (
							<div
								key={s.firebaseKey}
								className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 overflow-hidden"
							>
								<div className="p-6 flex flex-col items-center text-center">
									{s.photoUrl ? (
										<img
											src={s.photoUrl}
											alt={s.name}
											className="w-24 h-24 rounded-full object-cover border-2 border-teal-100 mb-4"
										/>
									) : (
										<div className="w-24 h-24 rounded-full bg-teal-50 flex items-center justify-center mb-4 border-2 border-teal-100">
											<span className="text-3xl font-bold text-teal-600">
												{s.name.charAt(0).toUpperCase()}
											</span>
										</div>
									)}
									<h3 className="text-lg font-semibold text-gray-900">{s.name}</h3>
									<span className="inline-block bg-teal-100 text-teal-800 px-3 py-0.5 rounded-full text-xs font-medium mt-1 mb-3">
										{s.role}
									</span>
									<div className="w-full space-y-2 text-left text-sm">
										<div className="flex justify-between py-1 border-b border-gray-50">
											<span className="text-gray-500">Age</span>
											<span className="text-gray-900 font-medium">{s.age}</span>
										</div>
										<div className="flex justify-between py-1 border-b border-gray-50">
											<span className="text-gray-500">Qualification</span>
											<span className="text-gray-900 font-medium">{s.qualification}</span>
										</div>
										<div className="flex justify-between py-1 border-b border-gray-50">
											<span className="text-gray-500">Phone</span>
											<span className="text-gray-900 font-medium">{s.phone}</span>
										</div>
										<div className="flex justify-between py-1">
											<span className="text-gray-500">Email</span>
											<span className="text-gray-900 font-medium text-xs break-all">{s.email}</span>
										</div>
									</div>
									<button
										onClick={() => showDeleteConfirm(s.firebaseKey, s.name)}
										className="mt-4 flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
									>
										<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
											<path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
										</svg>
										Remove
									</button>
								</div>
							</div>
						))}
					</div>
				)}

				<ConfirmModal
					open={confirmOpen}
					title="Remove staff member"
					description={pendingDeleteName ? `Remove ${pendingDeleteName} from the team? This action cannot be undone.` : "Remove this staff member? This action cannot be undone."}
					onConfirm={handleConfirmDelete}
					onCancel={handleCancelDelete}
					confirmLabel="Remove"
					cancelLabel="Cancel"
				/>
			</div>
		</main>
	);
}
