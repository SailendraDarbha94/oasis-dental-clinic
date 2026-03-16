"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { auth, uploadConsentFormPDF, saveConsentFormToRTDB } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { useToast } from "@/lib/toastContext";
import { pdf, Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";
import { fillConsentTemplate, FORM_TYPE_OPTIONS, getFormTypeLabel } from "@/lib/consentFormTemplates";
import type { ConsentFormType } from "@/lib/consentFormTemplates";

// ─── PDF colour palette ──────────────────────────────────────────────────────
const TEAL = "#0d9488";
const TEAL_DARK = "#0f766e";
const TEAL_PALE = "#ccfbf1";
const GRAY_50 = "#f9fafb";
const GRAY_100 = "#f3f4f6";
const GRAY_200 = "#e5e7eb";
const GRAY_400 = "#9ca3af";
const GRAY_500 = "#6b7280";
const GRAY_700 = "#374151";
const GRAY_900 = "#111827";
const WHITE = "#ffffff";

const s = StyleSheet.create({
	page: { backgroundColor: WHITE, fontSize: 10, fontFamily: "Helvetica", color: GRAY_900, paddingBottom: 56 },
	accentStripe: { backgroundColor: TEAL, height: 6 },
	content: { paddingHorizontal: 40, paddingTop: 28 },
	header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
	headerLeft: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
	logo: { width: 52, height: 52, borderRadius: 4 },
	clinicName: { fontSize: 17, fontFamily: "Helvetica-Bold", color: TEAL, marginBottom: 3 },
	clinicMeta: { fontSize: 8.5, color: GRAY_500, lineHeight: 1.5 },
	titleLabel: { fontSize: 26, fontFamily: "Helvetica-Bold", color: TEAL, letterSpacing: 2, textAlign: "right" },
	subtitleLabel: { fontSize: 12, color: GRAY_500, textAlign: "right", marginTop: 4, paddingHorizontal: 6 },
	dividerTeal: { borderBottomWidth: 2, borderBottomColor: TEAL, borderBottomStyle: "solid", marginBottom: 20 },
	sectionLabel: { fontSize: 8, fontFamily: "Helvetica-Bold", color: TEAL, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 6 },
	metaRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
	metaBox: { width: "47%" },
	patientName: { fontSize: 12, fontFamily: "Helvetica-Bold", color: GRAY_900, marginBottom: 3 },
	metaText: { fontSize: 9, color: GRAY_700, lineHeight: 1.55 },
	consentBox: { marginTop: 8, padding: 14, backgroundColor: GRAY_50, borderRadius: 4, borderLeftWidth: 3, borderLeftColor: TEAL, borderLeftStyle: "solid" },
	consentLabel: { fontSize: 8, fontFamily: "Helvetica-Bold", color: TEAL, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 },
	consentText: { fontSize: 10, color: GRAY_700, lineHeight: 1.7 },
	dateRow: { marginTop: 20, flexDirection: "row", justifyContent: "flex-end" },
	dateText: { fontSize: 9, color: GRAY_500 },
	signaturesRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 50, paddingHorizontal: 10 },
	signatureBlock: { width: "28%", alignItems: "center" },
	signatureLine: { borderBottomWidth: 1, borderBottomColor: GRAY_900, borderBottomStyle: "solid", width: "100%", marginBottom: 6 },
	signatureLabel: { fontSize: 9, fontFamily: "Helvetica-Bold", color: GRAY_700 },
	footer: { position: "absolute", bottom: 0, left: 0, right: 0, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 40, paddingVertical: 12, backgroundColor: GRAY_50, borderTopWidth: 1, borderTopColor: GRAY_200, borderTopStyle: "solid" },
	footerText: { fontSize: 7.5, color: GRAY_400 },
	footerBrand: { fontSize: 7.5, fontFamily: "Helvetica-Bold", color: TEAL },
});

// ─── Types ───────────────────────────────────────────────────────────────────
type ConsentForm = {
	patientName: string;
	age: string;
	gender: string;
	toothNumbers: string;
	doctorName: string;
	formType: ConsentFormType | "";
};

function generateConsentNumber() {
	const now = new Date();
	const y = now.getFullYear();
	const suffix = String(now.getTime()).slice(-6);
	return `CF-${y}-${suffix}`;
}

function formatDatePdf(d: Date) {
	return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

// ─── PDF Document ────────────────────────────────────────────────────────────
function ConsentDocument({
	form,
	consentNumber,
	consentDate,
	consentText,
}: {
	form: ConsentForm;
	consentNumber: string;
	consentDate: Date;
	consentText: string;
}) {
	const formTypeLabel = form.formType ? getFormTypeLabel(form.formType as ConsentFormType) : "";

	return (
		<Document title={`Consent Form ${consentNumber} – Oasis Dental Clinic`}>
			<Page size="A4" style={s.page}>
				<View style={s.accentStripe} />
				<View style={s.content}>
					{/* Header */}
					<View style={s.header}>
						<View style={s.headerLeft}>
							<Image src="/oasis-logo.png" style={s.logo} />
							<View>
								<Text style={s.clinicName}>Oasis Dental Clinic</Text>
								<Text style={s.clinicMeta}>
									A Sector, Papum Pare{"\n"}Arunachal Pradesh, India – 791110{"\n"}+91 91089 80207 · oasisdental@example.com
								</Text>
							</View>
						</View>
						<View>
							<Text style={s.titleLabel}>CONSENT{"\n"}FORM</Text>
							<Text style={s.subtitleLabel}>{formTypeLabel}</Text>
						</View>
					</View>

					<View style={s.dividerTeal} />

					{/* Patient details + Form details */}
					<View style={s.metaRow}>
						<View style={s.metaBox}>
							<Text style={s.sectionLabel}>Patient Information</Text>
							<Text style={s.patientName}>{form.patientName}</Text>
							<Text style={s.metaText}>Age: {form.age} yrs</Text>
							<Text style={s.metaText}>Gender: {form.gender}</Text>
						</View>
						<View style={s.metaBox}>
							<Text style={s.sectionLabel}>Form Details</Text>
							<Text style={s.metaText}>Consent No: {consentNumber}</Text>
							<Text style={s.metaText}>Date: {formatDatePdf(consentDate)}</Text>
							<Text style={s.metaText}>Doctor: Dr. {form.doctorName}</Text>
							<Text style={s.metaText}>Tooth No(s): {form.toothNumbers}</Text>
							<Text style={s.metaText}>Procedure: {formTypeLabel}</Text>
						</View>
					</View>

					{/* Consent text */}
					<View style={s.consentBox}>
						<Text style={s.consentLabel}>Informed Consent</Text>
						<Text style={s.consentText}>{consentText}</Text>
					</View>

					{/* Date */}
					<View style={s.dateRow}>
						<Text style={s.dateText}>Date: {formatDatePdf(consentDate)}</Text>
					</View>

					{/* Signatures */}
					<View style={s.signaturesRow}>
						<View style={s.signatureBlock}>
							<View style={s.signatureLine} />
							<Text style={s.signatureLabel}>Patient Signature</Text>
						</View>
						<View style={s.signatureBlock}>
							<View style={s.signatureLine} />
							<Text style={s.signatureLabel}>Doctor Signature</Text>
						</View>
						<View style={s.signatureBlock}>
							<View style={s.signatureLine} />
							<Text style={s.signatureLabel}>Witness Signature</Text>
						</View>
					</View>
				</View>

				<View style={s.footer} fixed>
					<Text style={s.footerText}>This is a computer-generated consent form.</Text>
					<Text style={s.footerBrand}>Oasis Dental Clinic · {consentNumber}</Text>
				</View>
			</Page>
		</Document>
	);
}

// ─── Form Component (reads search params) ────────────────────────────────────
function ConsentFormInner() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const { toast } = useToast();

	const [user, setUser] = useState<User | null | undefined>(undefined);
	const [loading, setLoading] = useState(false);

	const [form, setForm] = useState<ConsentForm>({
		patientName: searchParams.get("name") ?? "",
		age: searchParams.get("age") ?? "",
		gender: searchParams.get("gender") ?? "",
		toothNumbers: "",
		doctorName: "",
		formType: "",
	});

	useEffect(() => {
		const unsub = onAuthStateChanged(auth, (u) => {
			setUser(u);
			if (!u) router.replace("/");
		});
		return () => unsub();
	}, [router]);

	function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
		const { name, value } = e.target;
		setForm((s) => ({ ...s, [name]: value }));
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		const required: (keyof ConsentForm)[] = ["patientName", "age", "gender", "toothNumbers", "doctorName", "formType"];
		const missing = required.filter((k) => !form[k].trim());
		if (missing.length) {
			toast({ message: "Please fill all required fields.", type: "error" });
			return;
		}

		const formType = form.formType as ConsentFormType;
		setLoading(true);

		const consentNumber = generateConsentNumber();
		const consentDate = new Date();

		const consentText = fillConsentTemplate(formType, {
			name_of_patient: form.patientName,
			patient_age: form.age,
			patient_gender: form.gender,
			doctor_name: form.doctorName,
			tooth_numbers: form.toothNumbers,
		});

		try {
			const blob = await pdf(
				<ConsentDocument
					form={form}
					consentNumber={consentNumber}
					consentDate={consentDate}
					consentText={consentText}
				/>
			).toBlob();

			const fileName = `${consentNumber}.pdf`;

			const storageUrl = await uploadConsentFormPDF(fileName, blob);

			await saveConsentFormToRTDB({
				patientName: form.patientName,
				age: form.age,
				gender: form.gender,
				doctorName: form.doctorName,
				toothNumbers: form.toothNumbers,
				formType,
				consentNumber,
				storageUrl,
				fileName,
			});

			toast({ message: "Consent form generated successfully!", type: "success" });
			router.push("/admin/dashboard/consent_forms");
		} catch (err) {
			console.error("Failed to generate consent form", err);
			toast({ message: "Failed to generate consent form. Please try again.", type: "error" });
		} finally {
			setLoading(false);
		}
	}

	if (user === undefined) {
		return (
			<main className="min-h-screen bg-gray-50 flex items-center justify-center">
				<p className="text-gray-500">Loading...</p>
			</main>
		);
	}

	return (
		<main className="min-h-screen bg-gray-50 p-4 md:p-8">
			<div className="max-w-3xl mx-auto">
				{/* Back + Title */}
				<div className="flex items-center gap-4 mb-8">
					<button
						type="button"
						onClick={() => router.push("/admin/dashboard/consent_forms")}
						className="text-gray-500 hover:text-gray-700 transition-colors"
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
							<path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
						</svg>
					</button>
					<h1 className="text-lg md:text-3xl font-bold text-gray-900">Generate Consent Form</h1>
				</div>

				<form onSubmit={handleSubmit} noValidate className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
					{/* Patient Information */}
					<div className="p-6 md:p-8 border-b border-gray-100">
						<h2 className="text-sm font-bold text-teal-700 uppercase tracking-wider mb-5">Patient Information</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Patient Name <span className="text-red-500">*</span>
								</label>
								<input
									name="patientName"
									type="text"
									required
									value={form.patientName}
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
									min={0}
									required
									value={form.age}
									onChange={handleChange}
									placeholder="Age"
									className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Gender <span className="text-red-500">*</span>
								</label>
								<select
									name="gender"
									required
									value={form.gender}
									onChange={handleChange}
									className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
								>
									<option value="">Select gender</option>
									<option value="Male">Male</option>
									<option value="Female">Female</option>
									<option value="Other">Other</option>
								</select>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Tooth Number(s) <span className="text-red-500">*</span>
								</label>
								<input
									name="toothNumbers"
									type="text"
									required
									value={form.toothNumbers}
									onChange={handleChange}
									placeholder="e.g. 11, 21"
									className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
								/>
							</div>
						</div>
					</div>

					{/* Procedure Details */}
					<div className="p-6 md:p-8 border-b border-gray-100">
						<h2 className="text-sm font-bold text-teal-700 uppercase tracking-wider mb-5">Procedure Details</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Doctor Name <span className="text-red-500">*</span>
								</label>
								<input
									name="doctorName"
									type="text"
									required
									value={form.doctorName}
									onChange={handleChange}
									placeholder="Doctor's name"
									className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Consent Form Type <span className="text-red-500">*</span>
								</label>
								<select
									name="formType"
									required
									value={form.formType}
									onChange={handleChange}
									className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
								>
									<option value="">Select procedure</option>
									{FORM_TYPE_OPTIONS.map((o) => (
										<option key={o.value} value={o.value}>
											{o.label}
										</option>
									))}
								</select>
							</div>
						</div>
					</div>

					{/* Submit */}
					<div className="p-6 md:p-8 bg-gray-50 flex flex-col sm:flex-row items-center justify-end gap-3">
						<button
							type="button"
							onClick={() => router.push("/admin/dashboard/consent_forms")}
							className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors text-sm"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={loading}
							className={`w-full sm:w-auto px-8 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold transition-colors text-sm shadow-sm ${
								loading ? "opacity-60 cursor-not-allowed" : ""
							}`}
						>
							{loading ? "Generating..." : "Generate Consent Form"}
						</button>
					</div>
				</form>
			</div>
		</main>
	);
}

// ─── Page wrapper with Suspense for useSearchParams ──────────────────────────
export default function ConsentFormPage() {
	return (
		<Suspense
			fallback={
				<main className="min-h-screen bg-gray-50 flex items-center justify-center">
					<p className="text-gray-500">Loading...</p>
				</main>
			}
		>
			<ConsentFormInner />
		</Suspense>
	);
}
