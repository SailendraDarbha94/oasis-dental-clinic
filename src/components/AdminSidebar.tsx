"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

const navLinks = [
	{ href: "/admin/dashboard", label: "Dashboard" },
	{ href: "/admin/dashboard/archive", label: "Archive" },
	{ href: "/admin/dashboard/billing", label: "Billing" },
];

export default function AdminSidebar() {
	const pathname = usePathname();
	const router = useRouter();
	const [menuOpen, setMenuOpen] = useState(false);

	async function handleLogout() {
		try {
			await signOut(auth);
			router.replace("/");
		} catch (err) {
			console.error("Sign out failed", err);
		}
	}

	function NavItem({ link, onClick }: { link: { href: string; label: string }; onClick?: () => void }) {
		const isActive = pathname === link.href;
		return (
			<Link
				href={link.href}
				onClick={onClick}
				className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
					isActive
						? "bg-teal-50 text-teal-700 font-semibold"
						: "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
				}`}
			>
				{link.label}
			</Link>
		);
	}

	return (
		<>
			{/* ── Desktop sidebar ── */}
			<aside className="hidden md:flex flex-col w-64 min-h-screen bg-white border-r border-gray-200 fixed top-0 left-0 z-40">
				{/* Logo */}
				<div className="p-5">
					<div className="flex items-center gap-3 border-2 border-teal-200 rounded-xl p-3">
						<Image
							src="/oasis-logo.png"
							alt="Oasis Dental"
							width={36}
							height={36}
							className="object-contain"
						/>
						<span className="text-base font-bold text-teal-600">Oasis Dental</span>
					</div>
				</div>

				{/* Nav */}
				<nav className="flex-1 px-3 space-y-1 mt-2">
					{navLinks.map((link) => (
						<NavItem key={link.href} link={link} />
					))}
				</nav>

				{/* Logout */}
				<div className="p-4 border-t border-gray-200">
					<button
						onClick={handleLogout}
						className="w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
					>
						Logout
					</button>
				</div>
			</aside>

			{/* ── Mobile top bar ── */}
			<div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-40">
				<div className="flex items-center gap-2 border-2 border-teal-200 rounded-xl px-3 py-1.5">
					<Image
						src="/oasis-logo.png"
						alt="Oasis Dental"
						width={26}
						height={26}
						className="object-contain"
					/>
					<span className="text-sm font-bold text-teal-600">Oasis Dental</span>
				</div>
				<button
					onClick={() => setMenuOpen((o) => !o)}
					className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
					aria-label="Toggle navigation"
				>
					{menuOpen ? (
						<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					) : (
						<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
						</svg>
					)}
				</button>
			</div>

			{/* ── Mobile dropdown ── */}
			{menuOpen && (
				<div className="md:hidden bg-white border-b border-gray-200 px-4 pb-3 z-30">
					<nav className="space-y-1 pt-2">
						{navLinks.map((link) => (
							<NavItem key={link.href} link={link} onClick={() => setMenuOpen(false)} />
						))}
					</nav>
					<div className="mt-2 pt-2 border-t border-gray-200">
						<button
							onClick={handleLogout}
							className="w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
						>
							Logout
						</button>
					</div>
				</div>
			)}
		</>
	);
}
