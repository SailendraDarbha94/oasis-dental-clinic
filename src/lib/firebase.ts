import { getApps, getApp, initializeApp } from "firebase/app";
import { getAuth, browserLocalPersistence } from 'firebase/auth';
import { getDatabase, ref, push, set, serverTimestamp } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID
};

// Initialize Firebase app (prevent duplicate initialization)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);

// Initialize Analytics only on client side and if supported
export const analytics = typeof window !== 'undefined' ? 
  isSupported().then(yes => yes ? getAnalytics(app) : null) : null;

// Set auth persistence
if (typeof window !== 'undefined') {
  auth.setPersistence(browserLocalPersistence);
}

export default app;

export type AppointmentRecord = {
  id?: string;
  name: string;
  phone: string;
  age?: string;
  date: string;
  time: string;
  createdAt?: any;
  status?: string;
};

export async function saveAppointmentToRTDB(appointment: AppointmentRecord) {
  if (!appointment || !appointment.name || !appointment.phone || !appointment.date || !appointment.time) {
    throw new Error("Missing required appointment fields");
  }

  const appointmentsRef = ref(database, "oasis/appointments");
  console.log("Saving appointment to RTDB:", appointmentsRef);
  const newRef = push(appointmentsRef);
  const payload = {
    ...appointment,
    createdAt: serverTimestamp(),
    status: "new",
  };

  await set(newRef, payload);
  return newRef.key;
}