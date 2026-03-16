import { getApps, getApp, initializeApp } from "firebase/app";
import { getAuth, browserLocalPersistence } from 'firebase/auth';
import { getDatabase, ref, push, set, serverTimestamp } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
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
  gender?: string;
  date: string;
  time: string;
  createdAt?: any;
  status?: string;
};

export type BillRecord = {
  id?: string;
  firebaseKey?: string;
  patientName: string;
  phone: string;
  age: string;
  gender: string;
  service: string;
  medication: string;
  postOpInstructions: string;
  amount: number;
  tax: number;
  total: number;
  invoiceNumber: string;
  createdAt?: any;
  storageUrl: string;
  fileName: string;
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

export async function saveBillMetadataToRTDB(bill: Omit<BillRecord, 'firebaseKey'>) {
  const billsRef = ref(database, "oasis/bills");
  const newRef = push(billsRef);
  const payload = {
    ...bill,
    createdAt: serverTimestamp(),
  };
  await set(newRef, payload);
  return newRef.key;
}

export async function uploadBillPDF(fileName: string, blob: Blob): Promise<string> {
  const fileRef = storageRef(storage, `oasis/bills/${fileName}`);
  await uploadBytes(fileRef, blob);
  return getDownloadURL(fileRef);
}

export type StaffRecord = {
  id?: string;
  firebaseKey?: string;
  name: string;
  age: string;
  qualification: string;
  phone: string;
  email: string;
  role: string;
  photoUrl: string;
  createdAt?: any;
};

export async function saveStaffToRTDB(staff: Omit<StaffRecord, 'firebaseKey'>) {
  const staffRef = ref(database, "oasis/staff");
  const newRef = push(staffRef);
  const payload = {
    ...staff,
    createdAt: serverTimestamp(),
  };
  await set(newRef, payload);
  return newRef.key;
}

export async function uploadStaffPhoto(fileName: string, file: File): Promise<string> {
  const fileRef = storageRef(storage, `oasis/staff/${fileName}`);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
}

export type ConsentFormRecord = {
  id?: string;
  firebaseKey?: string;
  patientName: string;
  age: string;
  gender: string;
  doctorName: string;
  toothNumbers: string;
  formType: "filling" | "rct";
  consentNumber: string;
  storageUrl: string;
  fileName: string;
  createdAt?: any;
};

export async function saveConsentFormToRTDB(record: Omit<ConsentFormRecord, 'firebaseKey'>) {
  const consentRef = ref(database, "oasis/consent-forms");
  const newRef = push(consentRef);
  const payload = {
    ...record,
    createdAt: serverTimestamp(),
  };
  await set(newRef, payload);
  return newRef.key;
}

export async function uploadConsentFormPDF(fileName: string, blob: Blob): Promise<string> {
  const fileRef = storageRef(storage, `oasis/consent-forms/${fileName}`);
  await uploadBytes(fileRef, blob);
  return getDownloadURL(fileRef);
}