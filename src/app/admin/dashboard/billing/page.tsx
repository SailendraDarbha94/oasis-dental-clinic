'use client';
import React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFViewer, Image } from '@react-pdf/renderer';
import { useRouter } from 'next/navigation';

// ─── Colour palette ───────────────────────────────────────────────────────────
const TEAL      = '#0d9488';
const TEAL_DARK = '#0f766e';
const TEAL_PALE = '#ccfbf1';
const GRAY_50   = '#f9fafb';
const GRAY_100  = '#f3f4f6';
const GRAY_200  = '#e5e7eb';
const GRAY_400  = '#9ca3af';
const GRAY_500  = '#6b7280';
const GRAY_700  = '#374151';
const GRAY_900  = '#111827';
const WHITE     = '#ffffff';

const s = StyleSheet.create({
    // ── Page ──────────────────────────────────────────────────────────────────
    page: {
        backgroundColor: WHITE,
        fontSize: 10,
        fontFamily: 'Helvetica',
        color: GRAY_900,
        paddingBottom: 56, // room for fixed footer
    },

    // ── Top accent stripe ─────────────────────────────────────────────────────
    accentStripe: {
        backgroundColor: TEAL,
        height: 6,
    },

    // ── Content wrapper ───────────────────────────────────────────────────────
    content: {
        paddingHorizontal: 40,
        paddingTop: 28,
    },

    // ── Header: logo/clinic left | INVOICE label right ────────────────────────
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    logo: {
        width: 52,
        height: 52,
        borderRadius: 4,
    },
    clinicName: {
        fontSize: 17,
        fontFamily: 'Helvetica-Bold',
        color: TEAL,
        marginBottom: 3,
    },
    clinicMeta: {
        fontSize: 8.5,
        color: GRAY_500,
        lineHeight: 1.5,
    },
    invoiceLabel: {
        fontSize: 30,
        fontFamily: 'Helvetica-Bold',
        color: TEAL,
        letterSpacing: 2,
        textAlign: 'right',
    },
    invoiceSubLabel: {
        fontSize: 8.5,
        color: GRAY_500,
        textAlign: 'right',
        marginTop: 3,
        lineHeight: 1.6,
    },

    // ── Dividers ──────────────────────────────────────────────────────────────
    dividerTeal: {
        borderBottomWidth: 2,
        borderBottomColor: TEAL,
        borderBottomStyle: 'solid',
        marginBottom: 20,
    },
    dividerLight: {
        borderBottomWidth: 1,
        borderBottomColor: GRAY_200,
        borderBottomStyle: 'solid',
        marginVertical: 14,
    },

    // ── Bill-to / Invoice-details row ─────────────────────────────────────────
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    metaBox: {
        width: '47%',
    },
    sectionLabel: {
        fontSize: 8,
        fontFamily: 'Helvetica-Bold',
        color: TEAL,
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        marginBottom: 6,
    },
    patientName: {
        fontSize: 12,
        fontFamily: 'Helvetica-Bold',
        color: GRAY_900,
        marginBottom: 3,
    },
    metaText: {
        fontSize: 9,
        color: GRAY_700,
        lineHeight: 1.55,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    detailKey: {
        fontSize: 9,
        color: GRAY_500,
        width: '48%',
    },
    detailVal: {
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
        color: GRAY_900,
        width: '48%',
        textAlign: 'right',
    },
    statusPill: {
        alignSelf: 'flex-end',
        backgroundColor: TEAL_PALE,
        borderRadius: 20,
        paddingHorizontal: 8,
        paddingVertical: 3,
        marginTop: 4,
    },
    statusPillText: {
        fontSize: 8,
        fontFamily: 'Helvetica-Bold',
        color: TEAL_DARK,
    },

    // ── Services table ────────────────────────────────────────────────────────
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: TEAL,
        paddingVertical: 7,
        paddingHorizontal: 8,
        borderRadius: 3,
        marginBottom: 1,
    },
    tableHeaderCell: {
        fontSize: 8.5,
        fontFamily: 'Helvetica-Bold',
        color: WHITE,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 7,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: GRAY_100,
        borderBottomStyle: 'solid',
    },
    tableRowAlt: {
        backgroundColor: GRAY_50,
    },
    tableCell: {
        fontSize: 9,
        color: GRAY_700,
    },
    tableCellBold: {
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
        color: GRAY_900,
    },
    // column widths
    colNo:      { width: '6%' },
    colDesc:    { width: '46%' },
    colQty:     { width: '12%', textAlign: 'center' },
    colRate:    { width: '18%', textAlign: 'right' },
    colAmt:     { width: '18%', textAlign: 'right' },

    // ── Totals ────────────────────────────────────────────────────────────────
    totalsWrapper: {
        alignItems: 'flex-end',
        marginTop: 10,
    },
    totalsBox: {
        width: '42%',
    },
    totalsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
        borderBottomWidth: 1,
        borderBottomColor: GRAY_100,
        borderBottomStyle: 'solid',
    },
    totalsKey: {
        fontSize: 9,
        color: GRAY_500,
    },
    totalsVal: {
        fontSize: 9,
        color: GRAY_700,
    },
    grandTotalBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: TEAL,
        paddingVertical: 7,
        paddingHorizontal: 10,
        borderRadius: 3,
        marginTop: 6,
    },
    grandTotalKey: {
        fontSize: 10,
        fontFamily: 'Helvetica-Bold',
        color: WHITE,
    },
    grandTotalVal: {
        fontSize: 11,
        fontFamily: 'Helvetica-Bold',
        color: WHITE,
    },

    // ── Notes box ─────────────────────────────────────────────────────────────
    notesBox: {
        marginTop: 24,
        padding: 12,
        backgroundColor: GRAY_50,
        borderRadius: 4,
        borderLeftWidth: 3,
        borderLeftColor: TEAL,
        borderLeftStyle: 'solid',
    },
    notesLabel: {
        fontSize: 8,
        fontFamily: 'Helvetica-Bold',
        color: TEAL,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 5,
    },
    notesText: {
        fontSize: 8.5,
        color: GRAY_500,
        lineHeight: 1.6,
    },

    // ── Fixed footer ──────────────────────────────────────────────────────────
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingVertical: 12,
        backgroundColor: GRAY_50,
        borderTopWidth: 1,
        borderTopColor: GRAY_200,
        borderTopStyle: 'solid',
    },
    footerText: {
        fontSize: 7.5,
        color: GRAY_400,
    },
    footerBrand: {
        fontSize: 7.5,
        fontFamily: 'Helvetica-Bold',
        color: TEAL,
    },
});

// ─── Placeholder data (replace with real props / fetch as needed) ─────────────
const INVOICE = {
    number:  'INV-2026-0042',
    date:    '11 March 2026',
    dueDate: '18 March 2026',
    status:  'PAID',
};

const PATIENT = {
    name:    'John Doe',
    phone:   '9876543210',
    age:     '34',
    address: 'B-12, New Colony\nItanagar, Arunachal Pradesh\nIndia – 791111',
};

const SERVICES = [
    { desc: 'Initial Consultation & Examination', qty: 1, rate: 500 },
    { desc: 'Dental X-Ray (OPG)',                  qty: 1, rate: 800 },
    { desc: 'Scaling & Polishing',                 qty: 1, rate: 1200 },
    { desc: 'Composite Filling (per tooth)',        qty: 2, rate: 1500 },
];

const SUBTOTAL = SERVICES.reduce((s, r) => s + r.qty * r.rate, 0);
const TAX_RATE = 0.05;
const TAX      = SUBTOTAL * TAX_RATE;
const TOTAL    = SUBTOTAL + TAX;

const fmt = (n: number) => `₹ ${n.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

// ─── Component ────────────────────────────────────────────────────────────────
export default function BillingPage() {
    const router = useRouter();

    const MyDocument = () => (
        <Document title={`Invoice ${INVOICE.number} – Oasis Dental Clinic`}>
            <Page size="A4" style={s.page}>

                {/* Top teal stripe */}
                <View style={s.accentStripe} />

                <View style={s.content}>

                    {/* ── Header ────────────────────────────────────────────── */}
                    <View style={s.header}>
                        {/* Left: logo + clinic info */}
                        <View style={s.headerLeft}>
                            <Image src="/oasis-logo.png" style={s.logo} />
                            <View>
                                <Text style={s.clinicName}>Oasis Dental Clinic</Text>
                                <Text style={s.clinicMeta}>A Sector, Papum Pare{'\n'}Arunachal Pradesh, India – 791110{'\n'}+91 91089 80207  ·  oasisdental@example.com</Text>
                            </View>
                        </View>

                        {/* Right: INVOICE label + meta */}
                        <View>
                            <Text style={s.invoiceLabel}>INVOICE</Text>
                            <Text style={s.invoiceSubLabel}>
                                {INVOICE.number}{'\n'}
                                Date: {INVOICE.date}{'\n'}
                                Due:  {INVOICE.dueDate}
                            </Text>
                        </View>
                    </View>

                    {/* Teal divider */}
                    <View style={s.dividerTeal} />

                    {/* ── Bill-to + Invoice details ─────────────────────────── */}
                    <View style={s.metaRow}>
                        {/* Bill to */}
                        <View style={s.metaBox}>
                            <Text style={s.sectionLabel}>Bill To</Text>
                            <Text style={s.patientName}>{PATIENT.name}</Text>
                            <Text style={s.metaText}>Phone: {PATIENT.phone}</Text>
                            <Text style={s.metaText}>Age: {PATIENT.age} yrs</Text>
                            <Text style={s.metaText}>{PATIENT.address}</Text>
                        </View>

                        {/* Invoice details */}
                        <View style={s.metaBox}>
                            <Text style={s.sectionLabel}>Invoice Details</Text>
                            <View style={s.detailRow}>
                                <Text style={s.detailKey}>Invoice No.</Text>
                                <Text style={s.detailVal}>{INVOICE.number}</Text>
                            </View>
                            <View style={s.detailRow}>
                                <Text style={s.detailKey}>Invoice Date</Text>
                                <Text style={s.detailVal}>{INVOICE.date}</Text>
                            </View>
                            <View style={s.detailRow}>
                                <Text style={s.detailKey}>Due Date</Text>
                                <Text style={s.detailVal}>{INVOICE.dueDate}</Text>
                            </View>
                            <View style={s.detailRow}>
                                <Text style={s.detailKey}>Payment Status</Text>
                                <Text style={s.detailVal}> </Text>
                            </View>
                            <View style={s.statusPill}>
                                <Text style={s.statusPillText}>{INVOICE.status}</Text>
                            </View>
                        </View>
                    </View>

                    {/* ── Services table ────────────────────────────────────── */}
                    <Text style={s.sectionLabel}>Services Rendered</Text>

                    {/* Table header */}
                    <View style={s.tableHeader}>
                        <Text style={[s.tableHeaderCell, s.colNo]}>#</Text>
                        <Text style={[s.tableHeaderCell, s.colDesc]}>Description</Text>
                        <Text style={[s.tableHeaderCell, s.colQty]}>Qty</Text>
                        <Text style={[s.tableHeaderCell, s.colRate]}>Rate</Text>
                        <Text style={[s.tableHeaderCell, s.colAmt]}>Amount</Text>
                    </View>

                    {/* Table rows */}
                    {SERVICES.map((row, i) => (
                        <View key={i} style={[s.tableRow, i % 2 !== 0 ? s.tableRowAlt : {}]}>
                            <Text style={[s.tableCell, s.colNo]}>{i + 1}</Text>
                            <Text style={[s.tableCellBold, s.colDesc]}>{row.desc}</Text>
                            <Text style={[s.tableCell, s.colQty]}>{row.qty}</Text>
                            <Text style={[s.tableCell, s.colRate]}>{fmt(row.rate)}</Text>
                            <Text style={[s.tableCell, s.colAmt]}>{fmt(row.qty * row.rate)}</Text>
                        </View>
                    ))}

                    {/* ── Totals ────────────────────────────────────────────── */}
                    <View style={s.totalsWrapper}>
                        <View style={s.totalsBox}>
                            <View style={s.totalsRow}>
                                <Text style={s.totalsKey}>Subtotal</Text>
                                <Text style={s.totalsVal}>{fmt(SUBTOTAL)}</Text>
                            </View>
                            <View style={s.totalsRow}>
                                <Text style={s.totalsKey}>GST (5%)</Text>
                                <Text style={s.totalsVal}>{fmt(TAX)}</Text>
                            </View>
                            <View style={s.totalsRow}>
                                <Text style={s.totalsKey}>Discount</Text>
                                <Text style={s.totalsVal}>₹ 0.00</Text>
                            </View>
                            <View style={s.grandTotalBar}>
                                <Text style={s.grandTotalKey}>TOTAL DUE</Text>
                                <Text style={s.grandTotalVal}>{fmt(TOTAL)}</Text>
                            </View>
                        </View>
                    </View>

                    {/* ── Notes ────────────────────────────────────────────── */}
                    <View style={s.notesBox}>
                        <Text style={s.notesLabel}>Notes &amp; Payment Info</Text>
                        <Text style={s.notesText}>
                            Please make payment via Cash, UPI (9108980207), or Bank Transfer within 7 days of issue.{'\n'}
                            For queries, contact us at oasisdental@example.com or visit the clinic during working hours (Mon–Sat, 10 AM – 6 PM).{'\n'}
                            Thank you for trusting Oasis Dental Clinic with your care!
                        </Text>
                    </View>

                </View>

                {/* ── Footer ──────────────────────────────────────────────── */}
                <View style={s.footer} fixed>
                    <Text style={s.footerText}>This is a computer-generated invoice and does not require a signature.</Text>
                    <Text style={s.footerBrand}>Oasis Dental Clinic  ·  {INVOICE.number}</Text>
                </View>

            </Page>
        </Document>
    );

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="flex justify-center mb-6">
                <button
                    onClick={() => router.push('/admin/dashboard')}
                    className="bg-teal-600 text-white px-5 py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium shadow-sm"
                >
                    ← Back to Dashboard
                </button>
            </div>
            <PDFViewer width="900" height="700" className="rounded-xl shadow-2xl border border-gray-200">
                <MyDocument />
            </PDFViewer>
        </div>
    );
}