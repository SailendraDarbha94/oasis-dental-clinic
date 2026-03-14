"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { auth, uploadBillPDF, saveBillMetadataToRTDB } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { useToast } from "@/lib/toastContext";
import { pdf, Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";

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
	invoiceLabel: { fontSize: 30, fontFamily: "Helvetica-Bold", color: TEAL, letterSpacing: 2, textAlign: "right" },
	invoiceSubLabel: { fontSize: 8.5, color: GRAY_500, textAlign: "right", marginTop: 3, lineHeight: 1.6 },
	dividerTeal: { borderBottomWidth: 2, borderBottomColor: TEAL, borderBottomStyle: "solid", marginBottom: 20 },
	metaRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
	metaBox: { width: "47%" },
	sectionLabel: { fontSize: 8, fontFamily: "Helvetica-Bold", color: TEAL, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 6 },
	patientName: { fontSize: 12, fontFamily: "Helvetica-Bold", color: GRAY_900, marginBottom: 3 },
	metaText: { fontSize: 9, color: GRAY_700, lineHeight: 1.55 },
	detailRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
	detailKey: { fontSize: 9, color: GRAY_500, width: "48%" },
	detailVal: { fontSize: 9, fontFamily: "Helvetica-Bold", color: GRAY_900, width: "48%", textAlign: "right" },
	statusPill: { alignSelf: "flex-end", backgroundColor: TEAL_PALE, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3, marginTop: 4 },
	statusPillText: { fontSize: 8, fontFamily: "Helvetica-Bold", color: TEAL_DARK },
	tableHeader: { flexDirection: "row", backgroundColor: TEAL, paddingVertical: 7, paddingHorizontal: 8, borderRadius: 3, marginBottom: 1 },
	tableHeaderCell: { fontSize: 8.5, fontFamily: "Helvetica-Bold", color: WHITE, textTransform: "uppercase", letterSpacing: 0.5 },
	tableRow: { flexDirection: "row", paddingVertical: 7, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: GRAY_100, borderBottomStyle: "solid" },
	tableRowAlt: { backgroundColor: GRAY_50 },
	tableCell: { fontSize: 9, color: GRAY_700 },
	tableCellBold: { fontSize: 9, fontFamily: "Helvetica-Bold", color: GRAY_900 },
	colNo: { width: "6%" },
	colDesc: { width: "46%" },
	colQty: { width: "12%", textAlign: "center" },
	colRate: { width: "18%", textAlign: "right" },
	colAmt: { width: "18%", textAlign: "right" },
	totalsWrapper: { alignItems: "flex-end", marginTop: 10 },
	totalsBox: { width: "42%" },
	totalsRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: GRAY_100, borderBottomStyle: "solid" },
	totalsKey: { fontSize: 9, color: GRAY_500 },
	totalsVal: { fontSize: 9, color: GRAY_700 },
	grandTotalBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: TEAL, paddingVertical: 7, paddingHorizontal: 10, borderRadius: 3, marginTop: 6 },
	grandTotalKey: { fontSize: 10, fontFamily: "Helvetica-Bold", color: WHITE },
	grandTotalVal: { fontSize: 11, fontFamily: "Helvetica-Bold", color: WHITE },
	notesBox: { marginTop: 24, padding: 12, backgroundColor: GRAY_50, borderRadius: 4, borderLeftWidth: 3, borderLeftColor: TEAL, borderLeftStyle: "solid" },
	notesLabel: { fontSize: 8, fontFamily: "Helvetica-Bold", color: TEAL, textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 },
	notesText: { fontSize: 8.5, color: GRAY_500, lineHeight: 1.6 },
	footer: { position: "absolute", bottom: 0, left: 0, right: 0, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 40, paddingVertical: 12, backgroundColor: GRAY_50, borderTopWidth: 1, borderTopColor: GRAY_200, borderTopStyle: "solid" },
	footerText: { fontSize: 7.5, color: GRAY_400 },
	footerBrand: { fontSize: 7.5, fontFamily: "Helvetica-Bold", color: TEAL },
});

// ─── Types ───────────────────────────────────────────────────────────────────
type BillForm = {
	patientName: string;
	phone: string;
	age: string;
	gender: string;
	service: string;
	medication: string;
	postOpInstructions: string;
	amount: string;
};

const SERVICE_OPTIONS = [
	{ value: "consultation", label: "Consultation" },
	{ value: "general", label: "General Dentistry" },
	{ value: "cosmetic", label: "Cosmetic Dentistry" },
	{ value: "orthodontics", label: "Orthodontics" },
	{ value: "surgery", label: "Oral Surgery" },
	{ value: "emergency", label: "Emergency Care" },
	{ value: "pediatric", label: "Pediatric Dentistry" },
];

const TAX_RATE = 0.05;

function generateInvoiceNumber() {
	const now = new Date();
	const y = now.getFullYear();
	const suffix = String(now.getTime()).slice(-6);
	return `INV-${y}-${suffix}`;
}

const fmtCurrency = (n: number) => `₹ ${n.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

function formatDatePdf(d: Date) {
	return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

// ─── PDF Document ────────────────────────────────────────────────────────────
function InvoiceDocument({
	form,
	invoiceNumber,
	invoiceDate,
	subtotal,
	tax,
	total,
}: {
	form: BillForm;
	invoiceNumber: string;
	invoiceDate: Date;
	subtotal: number;
	tax: number;
	total: number;
}) {
	const dueDate = new Date(invoiceDate);
	dueDate.setDate(dueDate.getDate() + 7);

	const serviceLabel = SERVICE_OPTIONS.find((o) => o.value === form.service)?.label ?? form.service;

	return (
		<Document title={`Invoice ${invoiceNumber} – Oasis Dental Clinic`}>
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
							<Text style={s.invoiceLabel}>INVOICE</Text>
							<Text style={s.invoiceSubLabel}>
								{invoiceNumber}
								{"\n"}Date: {formatDatePdf(invoiceDate)}
								{"\n"}Due: {formatDatePdf(dueDate)}
							</Text>
						</View>
					</View>

					<View style={s.dividerTeal} />

					{/* Bill-to + Invoice details */}
					<View style={s.metaRow}>
						<View style={s.metaBox}>
							<Text style={s.sectionLabel}>Bill To</Text>
							<Text style={s.patientName}>{form.patientName}</Text>
							<Text style={s.metaText}>Phone: {form.phone}</Text>
							<Text style={s.metaText}>Age: {form.age} yrs</Text>
							<Text style={s.metaText}>Gender: {form.gender}</Text>
						</View>
						<View style={s.metaBox}>
							<Text style={s.sectionLabel}>Invoice Details</Text>
							<View style={s.detailRow}>
								<Text style={s.detailKey}>Invoice No.</Text>
								<Text style={s.detailVal}>{invoiceNumber}</Text>
							</View>
							<View style={s.detailRow}>
								<Text style={s.detailKey}>Invoice Date</Text>
								<Text style={s.detailVal}>{formatDatePdf(invoiceDate)}</Text>
							</View>
							<View style={s.detailRow}>
								<Text style={s.detailKey}>Due Date</Text>
								<Text style={s.detailVal}>{formatDatePdf(dueDate)}</Text>
							</View>
							<View style={s.detailRow}>
								<Text style={s.detailKey}>Payment Status</Text>
								<Text style={s.detailVal}> </Text>
							</View>
							<View style={s.statusPill}>
								<Text style={s.statusPillText}>UNPAID</Text>
							</View>
						</View>
					</View>

					{/* Services table */}
					<Text style={s.sectionLabel}>Services Rendered</Text>
					<View style={s.tableHeader}>
						<Text style={[s.tableHeaderCell, s.colNo]}>#</Text>
						<Text style={[s.tableHeaderCell, s.colDesc]}>Description</Text>
						<Text style={[s.tableHeaderCell, s.colQty]}>Qty</Text>
						<Text style={[s.tableHeaderCell, s.colRate]}>Rate</Text>
						<Text style={[s.tableHeaderCell, s.colAmt]}>Amount</Text>
					</View>
					<View style={s.tableRow}>
						<Text style={[s.tableCell, s.colNo]}>1</Text>
						<Text style={[s.tableCellBold, s.colDesc]}>{serviceLabel}</Text>
						<Text style={[s.tableCell, s.colQty]}>1</Text>
						<Text style={[s.tableCell, s.colRate]}>{fmtCurrency(subtotal)}</Text>
						<Text style={[s.tableCell, s.colAmt]}>{fmtCurrency(subtotal)}</Text>
					</View>

					{/* Totals */}
					<View style={s.totalsWrapper}>
						<View style={s.totalsBox}>
							<View style={s.totalsRow}>
								<Text style={s.totalsKey}>Subtotal</Text>
								<Text style={s.totalsVal}>{fmtCurrency(subtotal)}</Text>
							</View>
							<View style={s.totalsRow}>
								<Text style={s.totalsKey}>GST (5%)</Text>
								<Text style={s.totalsVal}>{fmtCurrency(tax)}</Text>
							</View>
							<View style={s.totalsRow}>
								<Text style={s.totalsKey}>Discount</Text>
								<Text style={s.totalsVal}>₹ 0.00</Text>
							</View>
							<View style={s.grandTotalBar}>
								<Text style={s.grandTotalKey}>TOTAL DUE</Text>
								<Text style={s.grandTotalVal}>{fmtCurrency(total)}</Text>
							</View>
						</View>
					</View>

					{/* Medication & Post-op */}
					{(form.medication || form.postOpInstructions) && (
						<View style={s.notesBox}>
							{form.medication ? (
								<>
									<Text style={s.notesLabel}>Medication Prescribed</Text>
									<Text style={s.notesText}>{form.medication}</Text>
								</>
							) : null}
							{form.postOpInstructions ? (
								<>
									<Text style={[s.notesLabel, form.medication ? { marginTop: 8 } : {}]}>Post-Op Instructions</Text>
									<Text style={s.notesText}>{form.postOpInstructions}</Text>
								</>
							) : null}
						</View>
					)}

					{/* Notes */}
					<View style={[s.notesBox, { marginTop: form.medication || form.postOpInstructions ? 12 : 24 }]}>
						<Text style={s.notesLabel}>Notes & Payment Info</Text>
						<Text style={s.notesText}>
							Please make payment via Cash, UPI (9108980207), or Bank Transfer within 7 days of issue.{"\n"}
							For queries, contact us at oasisdental@example.com or visit the clinic during working hours (Mon–Sat, 10 AM – 6 PM).{"\n"}
							Thank you for trusting Oasis Dental Clinic with your care!
						</Text>
					</View>
				</View>

				<View style={s.footer} fixed>
					<Text style={s.footerText}>This is a computer-generated invoice and does not require a signature.</Text>
					<Text style={s.footerBrand}>Oasis Dental Clinic · {invoiceNumber}</Text>
				</View>
			</Page>
		</Document>
	);
}

// ─── Form Component (reads search params) ────────────────────────────────────
function BillFormInner() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const { toast } = useToast();

	const [user, setUser] = useState<User | null | undefined>(undefined);
	const [loading, setLoading] = useState(false);
	const [phoneError, setPhoneError] = useState<string | null>(null);

	const [form, setForm] = useState<BillForm>({
		patientName: searchParams.get("name") ?? "",
		phone: searchParams.get("phone") ?? "",
		age: searchParams.get("age") ?? "",
		gender: searchParams.get("gender") ?? "",
		service: searchParams.get("service") ?? "",
		medication: "",
		postOpInstructions: "",
		amount: "",
	});

	useEffect(() => {
		const unsub = onAuthStateChanged(auth, (u) => {
			setUser(u);
			if (!u) router.replace("/");
		});
		return () => unsub();
	}, [router]);

	function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
		const { name, value } = e.target;
		if (name === "phone") {
			const digits = value.replace(/\D/g, "").slice(0, 10);
			setForm((s) => ({ ...s, phone: digits }));
			if (phoneError) setPhoneError(null);
			return;
		}
		setForm((s) => ({ ...s, [name]: value }));
	}

	function handlePhoneBlur() {
		if (!/^\d{10}$/.test(form.phone)) {
			setPhoneError("Phone number must be exactly 10 digits");
		} else {
			setPhoneError(null);
		}
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		const required: (keyof BillForm)[] = ["patientName", "phone", "age", "gender", "service", "amount"];
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

		const amount = parseFloat(form.amount);
		if (isNaN(amount) || amount <= 0) {
			toast({ message: "Please enter a valid amount.", type: "error" });
			return;
		}

		setLoading(true);

		const invoiceNumber = generateInvoiceNumber();
		const invoiceDate = new Date();
		const subtotal = amount;
		const tax = subtotal * TAX_RATE;
		const total = subtotal + tax;

		try {
			// Generate PDF blob
			const blob = await pdf(
				<InvoiceDocument
					form={form}
					invoiceNumber={invoiceNumber}
					invoiceDate={invoiceDate}
					subtotal={subtotal}
					tax={tax}
					total={total}
				/>
			).toBlob();

			const fileName = `${invoiceNumber}.pdf`;

			// Upload to Firebase Storage
			const storageUrl = await uploadBillPDF(fileName, blob);

			// Save metadata to RTDB
			await saveBillMetadataToRTDB({
				patientName: form.patientName,
				phone: form.phone,
				age: form.age,
				gender: form.gender,
				service: SERVICE_OPTIONS.find((o) => o.value === form.service)?.label ?? form.service,
				medication: form.medication,
				postOpInstructions: form.postOpInstructions,
				amount: subtotal,
				tax,
				total,
				invoiceNumber,
				storageUrl,
				fileName,
			});

			toast({ message: "Bill generated successfully!", type: "success" });
			router.push("/admin/dashboard/billing");
		} catch (err) {
			console.error("Failed to generate bill", err);
			toast({ message: "Failed to generate bill. Please try again.", type: "error" });
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
						onClick={() => router.push("/admin/dashboard/billing")}
						className="text-gray-500 hover:text-gray-700 transition-colors"
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
							<path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
						</svg>
					</button>
					<h1 className="text-lg md:text-3xl font-bold text-gray-900">Generate Bill</h1>
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
									Phone <span className="text-red-500">*</span>
								</label>
								<input
									name="phone"
									type="tel"
									inputMode="numeric"
									required
									value={form.phone}
									onChange={handleChange}
									onBlur={handlePhoneBlur}
									placeholder="10 digit phone number"
									className={`w-full rounded-lg border px-4 py-2.5 focus:outline-none focus:ring-2 ${
										phoneError ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-teal-500 focus:border-transparent"
									}`}
								/>
								{phoneError && <p className="mt-1 text-sm text-red-600">{phoneError}</p>}
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
						</div>
					</div>

					{/* Service & Billing */}
					<div className="p-6 md:p-8 border-b border-gray-100">
						<h2 className="text-sm font-bold text-teal-700 uppercase tracking-wider mb-5">Service & Billing</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Service Availed <span className="text-red-500">*</span>
								</label>
								<select
									name="service"
									required
									value={form.service}
									onChange={handleChange}
									className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
								>
									<option value="">Select a service</option>
									{SERVICE_OPTIONS.map((o) => (
										<option key={o.value} value={o.value}>{o.label}</option>
									))}
								</select>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Amount (₹) <span className="text-red-500">*</span>
								</label>
								<input
									name="amount"
									type="number"
									min={0}
									step="0.01"
									required
									value={form.amount}
									onChange={handleChange}
									placeholder="Enter amount"
									className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
								/>
								{form.amount && !isNaN(parseFloat(form.amount)) && parseFloat(form.amount) > 0 && (
									<p className="mt-1 text-xs text-gray-500">
										GST (5%): {fmtCurrency(parseFloat(form.amount) * TAX_RATE)} · Total: {fmtCurrency(parseFloat(form.amount) * (1 + TAX_RATE))}
									</p>
								)}
							</div>
						</div>
					</div>

					{/* Medical Details */}
					<div className="p-6 md:p-8 border-b border-gray-100">
						<h2 className="text-sm font-bold text-teal-700 uppercase tracking-wider mb-5">Medical Details</h2>
						<div className="space-y-5">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Medication Prescribed</label>
								<textarea
									name="medication"
									value={form.medication}
									onChange={handleChange}
									rows={3}
									placeholder="List any medications prescribed..."
									className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Post-Op Instructions</label>
								<textarea
									name="postOpInstructions"
									value={form.postOpInstructions}
									onChange={handleChange}
									rows={3}
									placeholder="Any post-operative care instructions..."
									className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
								/>
							</div>
						</div>
					</div>

					{/* Submit */}
					<div className="p-6 md:p-8 bg-gray-50 flex flex-col sm:flex-row items-center justify-end gap-3">
						<button
							type="button"
							onClick={() => router.push("/admin/dashboard/billing")}
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
							{loading ? "Generating..." : "Generate Bill"}
						</button>
					</div>
				</form>
			</div>
		</main>
	);
}

// ─── Page wrapper with Suspense for useSearchParams ──────────────────────────
export default function BillFormPage() {
	return (
		<Suspense
			fallback={
				<main className="min-h-screen bg-gray-50 flex items-center justify-center">
					<p className="text-gray-500">Loading...</p>
				</main>
			}
		>
			<BillFormInner />
		</Suspense>
	);
}
