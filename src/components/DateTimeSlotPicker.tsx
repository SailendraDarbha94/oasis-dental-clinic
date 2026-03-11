"use client";
import React, { useState, useEffect, useRef } from "react";
import { database } from "@/lib/firebase";
import { ref, get, set, remove, onValue } from "firebase/database";

// Default time slots: 10 AM – 6 PM, 30-min intervals, lunch break 1 PM – 3 PM
export const DEFAULT_TIME_SLOTS = [
	"10:00 AM",
	"10:30 AM",
	"11:00 AM",
	"11:30 AM",
	"12:00 PM",
	"12:30 PM",
	// Lunch break 1:00 PM – 3:00 PM
	"3:00 PM",
	"3:30 PM",
	"4:00 PM",
	"4:30 PM",
	"5:00 PM",
	"5:30 PM",
	"6:00 PM",
];

/** Convert a slot label to a Firebase-safe key, e.g. "10:00 AM" → "10_00_AM" */
function slotToKey(slot: string): string {
	return slot.replace(/[: ]/g, "_");
}

type Props = {
	date: string;
	time: string;
	onDateChange: (date: string) => void;
	onTimeChange: (time: string) => void;
};

export default function DateTimeSlotPicker({ date, time, onDateChange, onTimeChange }: Props) {
	const [availableSlots, setAvailableSlots] = useState<string[]>([]);
	const [loadingSlots, setLoadingSlots] = useState(false);
	// Holds the Firebase real-time unsubscribe function for the active date listener
	const unsubscribeRef = useRef<(() => void) | null>(null);

	/**
	 * Runs when the user selects a date.
	 * - Checks oasis/slots_booked/<date> in Firebase RTDB.
	 * - If the date has no entry, creates one with all default slots.
	 * - Subscribes to real-time updates so the slot list stays fresh.
	 */
	async function updateSlots(selectedDate: string) {
		// Tear down the listener for the previous date
		if (unsubscribeRef.current) {
			unsubscribeRef.current();
			unsubscribeRef.current = null;
		}

		if (!selectedDate) {
			setAvailableSlots([]);
			return;
		}

		setLoadingSlots(true);
		// Reset the time selection whenever the date changes
		onTimeChange("");

		const slotsRef = ref(database, `oasis/slots_booked/${selectedDate}`);

		// Seed the date entry if it does not yet exist
		const snapshot = await get(slotsRef);
		if (!snapshot.exists()) {
			const defaultData: Record<string, boolean> = {};
			DEFAULT_TIME_SLOTS.forEach((slot) => {
				defaultData[slotToKey(slot)] = true;
			});
			await set(slotsRef, defaultData);
		}

		// Subscribe to real-time changes so concurrent bookings are reflected immediately
		const unsubscribe = onValue(slotsRef, (snap) => {
			const data = snap.val() as Record<string, boolean> | null;
			if (data) {
				// Preserve the original display order from DEFAULT_TIME_SLOTS
				const slots = DEFAULT_TIME_SLOTS.filter((slot) => data[slotToKey(slot)] === true);
				setAvailableSlots(slots);
			} else {
				setAvailableSlots([]);
			}
			setLoadingSlots(false);
		});

		unsubscribeRef.current = unsubscribe;
	}

	/**
	 * Runs when the user picks a time slot.
	 * Removes the chosen slot from Firebase so it no longer appears for other users.
	 */
	async function handleSlotSelect(slot: string) {
		if (!slot) {
			onTimeChange("");
			return;
		}

		onTimeChange(slot);

		if (!date) return;

		// Remove the slot from the database to mark it as taken
		const slotRef = ref(database, `oasis/slots_booked/${date}/${slotToKey(slot)}`);
		await remove(slotRef);
	}

	// Re-run updateSlots whenever the date prop changes
	useEffect(() => {
		updateSlots(date);

		// Cleanup listener on unmount or before next effect run
		return () => {
			if (unsubscribeRef.current) {
				unsubscribeRef.current();
				unsubscribeRef.current = null;
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [date]);

	// The minimum selectable date is today
	const today = new Date().toISOString().split("T")[0];

	// After a slot is selected it gets removed from Firebase (and therefore from
	// availableSlots), but the controlled <select> still holds that value via the
	// `time` prop.  Without a matching <option> the browser renders a blank select.
	// Re-insert the selected slot at its original position so the UI stays correct.
	const slotsToDisplay =
		time && !availableSlots.includes(time)
			? DEFAULT_TIME_SLOTS.filter(
				(s) => availableSlots.includes(s) || s === time
			)
			: availableSlots;

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
			{/* Date picker */}
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
				<input
					name="date"
					type="date"
					required
					min={today}
					value={date}
					onChange={(e) => onDateChange(e.target.value)}
					className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300"
				/>
			</div>

			{/* Time slot picker */}
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">Time</label>

				{loadingSlots ? (
					<div className="w-full rounded-lg border border-gray-200 px-4 py-2 text-gray-400 text-sm">
						Loading available slots…
					</div>
				) : (
					<select
						name="time"
						required
						value={time}
						onChange={(e) => handleSlotSelect(e.target.value)}
						disabled={!date}
						className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<option value="">{date ? "Select a time slot" : "Pick a date first"}</option>
						{slotsToDisplay.map((slot) => (
							<option key={slot} value={slot}>
								{slot}
							</option>
						))}
					</select>
				)}

				{date && !loadingSlots && availableSlots.length === 0 && (
					<p className="mt-1 text-sm text-red-500">No slots available for this date.</p>
				)}
			</div>
		</div>
	);
}
