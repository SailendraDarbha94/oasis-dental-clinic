"use client";
import { useToast } from "@/lib/toastContext";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
// import { getDatabase, ref, onValue } from "firebase/database";

type FormData = {
	id?: string;
	name: string;
	phone: string;
	age: string;
	date: string;
	time: string;
	createdAt?: string;
};

const STORAGE_KEY = "oasis_appointments";

function saveAppointment(a: FormData) {
	try {
		const raw = localStorage.getItem(STORAGE_KEY) || "[]";
		const arr: FormData[] = JSON.parse(raw);
		arr.unshift(a);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
	} catch (err) {
		console.error("Failed to save appointment", err);
	}
}

export default function AppointmentPage() {
	const [form, setForm] = useState<FormData>({
		name: "",
		phone: "",
		age: "",
		date: "",
		time: "",
	});

	const [submitted, setSubmitted] = useState(false);

	const router = useRouter();
	const { toast } = useToast();

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setForm((s) => ({ ...s, [name]: value }));
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		const missing = Object.entries(form).filter(([, v]) => v.toString().trim() === "");
		if (missing.length) {
			alert("Please fill all required fields.");
			return;
		}

		const payload: FormData = {
			...form,
			id: `${Date.now()}`,
			createdAt: new Date().toISOString(),
		};

		// persist to localStorage so admin can view
		saveAppointment(payload);

		toast({ message: "Your Appointment is Booked", type: "success" });
		console.log("Appointment submitted:", payload);
		setSubmitted(true);
		setTimeout(() => router.push("/"), 900);
	}

	return (
		<main className="min-h-screen flex items-center justify-center py-12 px-4">
			<div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
				<h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Book an Appointment</h1>

				{submitted ? (
					<div className="p-6 bg-teal-50 rounded-lg border border-teal-100">
						<p className="text-teal-700 font-medium">Your appointment request was logged. Thank you!</p>
					</div>
				) : (
					<form onSubmit={handleSubmit} noValidate className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
							<input
								name="name"
								type="text"
								required
								value={form.name}
								onChange={handleChange}
								placeholder="Full name"
								className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
							<input
								name="phone"
								type="tel"
								required
								value={form.phone}
								onChange={handleChange}
								placeholder="e.g. +1 555 555 5555"
								className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300"
							/>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
							<div className="sm:col-span-1">
								<label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
								<input
									name="age"
									type="number"
									min={0}
									required
									value={form.age}
									onChange={handleChange}
									placeholder="Age"
									className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
								<input
									name="date"
									type="date"
									required
									value={form.date}
									onChange={handleChange}
									className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
								<input
									name="time"
									type="time"
									required
									value={form.time}
									onChange={handleChange}
									className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300"
								/>
							</div>
						</div>

						<div className="pt-2">
							<button
								type="submit"
								className="w-full bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold shadow-sm transition-colors"
							>
								Submit
							</button>
						</div>
					</form>
				)}
			</div>
		</main>
	);
}

