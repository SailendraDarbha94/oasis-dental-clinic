"use client";
import Header from "@/components/Header";
import DateTimeSlotPicker from "@/components/DateTimeSlotPicker";
import { useToast } from "@/lib/toastContext";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { saveAppointmentToRTDB, AppointmentRecord } from "@/lib/firebase";

type FormData = {
	id?: string;
	name: string;
	phone: string;
	age: string;
	service: string;
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
		service: "",
		date: "",
		time: "",
	});

	const [submitted, setSubmitted] = useState(false);

	const [phoneError, setPhoneError] = useState<string | null>(null);

	const [loading, setLoading] = useState(false);

	const router = useRouter();
	const { toast } = useToast();

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		if (name === "phone") {
			// Allow only digits and cap to 10 characters while typing
			const digits = value.replace(/\D/g, "").slice(0, 10);
			setForm((s) => ({ ...s, phone: digits }));
			// clear error while typing until blur/submit
			if (phoneError) setPhoneError(null);
			return;
		}

		setForm((s) => ({ ...s, [name]: value }));
	}

	function isValidPhone(p: string) {
		return /^\d{10}$/.test(p);
	}

	function handlePhoneBlur() {
		if (!isValidPhone(form.phone)) {
			setPhoneError("Phone number must be exactly 10 digits");
		} else {
			setPhoneError(null);
		}
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		const missing = Object.entries(form).filter(([, v]) => v.toString().trim() === "");
		if (missing.length) {
			toast({ message: "Please fill all required fields.", type: "error" });
			return;
		}

		if (!isValidPhone(form.phone)) {
			setPhoneError("Phone number must be exactly 10 digits");
			toast({ message: "Phone number must be exactly 10 digits.", type: "error" });
			return;
		}

		const payload: AppointmentRecord = {
			...form,
			id: `${Date.now()}`,
		};

		setLoading(true);
		try {
			await saveAppointmentToRTDB(payload);
			// persist to localStorage as fallback/admin view
			saveAppointment({ ...form, id: payload.id, createdAt: new Date().toISOString() } as FormData);
			toast({ message: "Your Appointment is Booked", type: "success" });
			setSubmitted(true);
			setTimeout(() => router.push("/"), 1500);
		} catch (err) {
			console.error("Failed to save appointment to RTDB", err);
			toast({ message: "Failed to submit appointment. Please try again.", type: "error" });
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-teal-700 via-blue-200 to-blue-700 flex flex-col">
			<Header />
			<main className=" flex items-center justify-center py-12 px-4">
				<div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
					<h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Book An Appointment</h1>

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
									inputMode="numeric"
									pattern="\d*"
									required
									value={form.phone}
									onChange={handleChange}
									onBlur={handlePhoneBlur}
									placeholder="Enter 10 digit phone number"
									className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 ${phoneError
										? "border-red-500 focus:ring-red-300"
										: "border-gray-200 focus:ring-teal-300"
										}`}
								/>
								{phoneError && <p className="mt-1 text-sm text-red-600">{phoneError}</p>}
							</div>

							<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
							<select
								name="service"
								required
								value={form.service}
								onChange={(e) => setForm((s) => ({ ...s, service: e.target.value }))}
								className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300"
							>
								<option value="">Select a service</option>
								<option value="consultation">Consultation</option>
								<option value="general">General Dentistry</option>
								<option value="cosmetic">Cosmetic Dentistry</option>
								<option value="orthodontics">Orthodontics</option>
								<option value="surgery">Oral Surgery</option>
								<option value="emergency">Emergency Care</option>
								<option value="pediatric">Pediatric Dentistry</option>
							</select>
						</div>

						<div>
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

						<DateTimeSlotPicker
							date={form.date}
							time={form.time}
							onDateChange={(date) => setForm((s) => ({ ...s, date }))}
							onTimeChange={(time) => setForm((s) => ({ ...s, time }))}
						/>

							<div className="pt-2">
								<button
									type="submit"
									disabled={loading}
									className={`w-full ${loading ? "opacity-60 cursor-not-allowed" : ""} bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold shadow-sm transition-colors`}
								>
									{loading ? "Submitting..." : "Submit"}
								</button>
							</div>
						</form>
					)}
				</div>
			</main>
		</div>
	);
}

