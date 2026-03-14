"use client";

import { useState, useEffect } from "react";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase"; // adjust this import to match your firebase config path
import Image from "next/image";
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import dynamic from 'next/dynamic';

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  },
);


export default function StorageTestPage() {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [imageError, setImageError] = useState<string | null>(null);
    const [imageLoading, setImageLoading] = useState(true);

    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [pdfError, setPdfError] = useState<string | null>(null);
    const [pdfLoading, setPdfLoading] = useState(true);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const imageRef = ref(storage, "oasis/420Titan.png");
                const url = await getDownloadURL(imageRef);
                setImageUrl(url);
            } catch (err: unknown) {
                console.error("Error fetching image:", err);
                setImageError(
                    err instanceof Error ? err.message : "Failed to fetch image from Firebase Storage"
                );
            } finally {
                setImageLoading(false);
            }
        };

        const fetchPdf = async () => {
            try {
                const pdfRef = ref(storage, "oasis/AGMApr2025ProceedingsEdit.pdf");
                const url = await getDownloadURL(pdfRef);
                setPdfUrl(url);
            } catch (err: unknown) {
                console.error("Error fetching PDF:", err);
                setPdfError(
                    err instanceof Error ? err.message : "Failed to fetch PDF from Firebase Storage"
                );
            } finally {
                setPdfLoading(false);
            }
        };

        fetchImage();
        fetchPdf();
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 gap-10">
            <h1 className="text-2xl font-bold">Firebase Storage Test</h1>

            {/* ── Image section ── */}
            <section className="w-full max-w-lg flex flex-col items-center gap-4">
                <h2 className="text-lg font-semibold">Image: <code className="bg-gray-100 px-2 py-1 rounded text-sm">oasis/420Titan.png</code></h2>

                {imageLoading && <p className="text-blue-500 animate-pulse">Loading image...</p>}

                {imageError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md w-full">
                        <p className="font-semibold">Error:</p>
                        <p className="text-sm">{imageError}</p>
                    </div>
                )}

                {imageUrl && (
                    <div className="flex flex-col items-center gap-4 w-full">
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md w-full">
                            ✅ Image fetched successfully!
                        </div>
                        <div className="border rounded-lg overflow-hidden shadow-md">
                            <Image
                                src={imageUrl}
                                alt="420titan"
                                width={400}
                                height={400}
                                unoptimized
                                className="object-contain"
                            />
                        </div>
                        <details className="w-full">
                            <summary className="cursor-pointer text-sm text-gray-500">Show download URL</summary>
                            <p className="text-xs break-all mt-2 bg-gray-50 p-2 rounded">{imageUrl}</p>
                        </details>
                    </div>
                )}
            </section>

            {/* ── PDF section ── */}
            <section className="w-full max-w-4xl flex flex-col items-center gap-4">
                <h2 className="text-lg font-semibold">PDF: <code className="bg-gray-100 px-2 py-1 rounded text-sm">oasis/AGMApr2025ProceedingsEdit.pdf</code></h2>

                {pdfLoading && <p className="text-blue-500 animate-pulse">Loading PDF...</p>}

                {pdfError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md w-full">
                        <p className="font-semibold">Error:</p>
                        <p className="text-sm">{pdfError}</p>
                    </div>
                )}

                {pdfUrl && (
                    <div className="flex flex-col items-center gap-4 w-full">
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md w-full">
                            ✅ PDF fetched successfully!
                        </div>
                        <iframe
                            src={pdfUrl}
                            className="w-full rounded-xl shadow-lg border border-gray-200"
                            style={{ height: "700px" }}
                            title="AGM Apr 2025 Proceedings"
                        />
                        <details className="w-full">
                            <summary className="cursor-pointer text-sm text-gray-500">Show download URL</summary>
                            <p className="text-xs break-all mt-2 bg-gray-50 p-2 rounded">{pdfUrl}</p>
                        </details>
                    </div>
                )}
            </section>
        </div>
    );
}