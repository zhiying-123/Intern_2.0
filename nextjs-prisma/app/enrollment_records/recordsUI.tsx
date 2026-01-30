"use client";
import { useState } from "react";

type Course = {
    c_id: number;
    c_name: string;
    c_description: string;
    c_category: string;
    c_duration: number;
    c_price: number;
};

type Record = {
    sc_id: number;
    u_id: number;
    c_id: number;
    enrollment_date: Date;
    status: string;
    grade_image: string | null;
    course: Course;
};

export default function EnrollmentRecordsUI({ records }: { records: Record[] }) {
    const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDING":
                return "bg-amber-100 text-amber-700 border-amber-300";
            case "APPROVED":
                return "bg-emerald-100 text-emerald-700 border-emerald-300";
            case "DISAPPROVED":
                return "bg-red-100 text-red-700 border-red-300";
            default:
                return "bg-gray-100 text-gray-700 border-gray-300";
        }
    };

    const printNotice = (record: Record) => {
        setSelectedRecord(record);
        setTimeout(() => window.print(), 100);
    };

    return (
        <>
            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    #print-notice, #print-notice * { visibility: visible; }
                    #print-notice { 
                        position: absolute; 
                        left: 0; 
                        top: 0; 
                        width: 100%; 
                        padding: 40px;
                        background: white !important;
                        box-shadow: 0 0 0 2px #1e293b;
                    }
                    .print-header {
                        background-color: #1e293b !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                        color: white !important;
                    }
                }
            `}</style>

            <div className="pt-36 px-6 min-h-screen bg-gray-50 pb-24">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-8 text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-wide">Enrollment Records</h1>
                        <p className="text-base text-gray-500">View all your course enrollment applications and their status</p>
                    </div>

                    {records.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
                            <p className="text-gray-500">No enrollment records found</p>
                        </div>
                    ) : (
                        <div className="space-y-6 bg-slate-50 rounded-2xl p-8 border border-slate-200">
                            {records.map((record, idx) => (
                                <div key={record.sc_id} className="relative bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-slate-800 mb-1 text-center md:text-left">{record.course.c_name}</h3>
                                        <p className="text-sm text-gray-500 mb-3 text-center md:text-left">{record.course.c_description}</p>

                                        <div className="grid grid-cols-3 gap-4 mb-4">
                                            <div>
                                                <p className="text-xs text-gray-400 uppercase tracking-wider">Category</p>
                                                <p className="text-sm text-gray-800">{record.course.c_category}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 uppercase tracking-wider">Duration</p>
                                                <p className="text-sm text-gray-800">{record.course.c_duration} hours</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 uppercase tracking-wider">Price</p>
                                                <p className="text-sm text-gray-800">RM {record.course.c_price}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div>
                                                <p className="text-xs text-gray-400 uppercase tracking-wider">Application Date</p>
                                                <p className="text-sm text-gray-800">{new Date(record.enrollment_date).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                {/* Only show status when APPROVED */}
                                                {record.status === "APPROVED" && (
                                                    <>
                                                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Status</p>
                                                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full border bg-emerald-100 text-emerald-700 border-emerald-300`}>
                                                            APPROVED
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {record.status === "APPROVED" && (
                                        <button
                                            onClick={() => printNotice(record)}
                                            className={`absolute right-4 bottom-4 px-6 py-2 bg-white text-sm font-semibold uppercase tracking-wider rounded-lg hover:bg-slate-50 transition shadow-sm border-2 border-emerald-600 text-emerald-700`}
                                        >
                                            Print Notice
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Print Template - only for APPROVED records */}
            {selectedRecord && selectedRecord.status === "APPROVED" && (
                <div id="print-notice" className="hidden print:block">
                    <div className="print-header bg-slate-800 py-10 px-10 border-b-4 border-slate-900 flex flex-col items-center">
                        <h1 className="text-5xl font-extrabold tracking-widest mb-2">ZY UNIVERSITY</h1>
                        <div className="text-lg text-slate-200 uppercase tracking-widest mb-2">Enrollment Notice</div>
                        <div className="text-xs text-slate-300 uppercase tracking-[0.3em]">Official Document</div>
                    </div>

                    <div className="p-12 border border-slate-200 rounded-b-2xl bg-white">
                        <div className="mb-12 border-l-4 pl-6 py-4 border-emerald-600 bg-emerald-50">
                            <div className="text-xs mb-2 uppercase tracking-widest text-emerald-700">Status</div>
                            <div className="text-2xl font-semibold text-emerald-700">Application Approved</div>
                        </div>

                        <div className="space-y-6 mb-12">
                            <div className="flex border-b border-gray-200 pb-5">
                                <div className="w-48 text-xs text-gray-400 uppercase tracking-widest pt-1">Course Title</div>
                                <div className="flex-1 text-lg font-semibold text-gray-900">{selectedRecord.course.c_name}</div>
                            </div>
                            <div className="flex border-b border-gray-200 pb-5">
                                <div className="w-48 text-xs text-gray-400 uppercase tracking-widest pt-1">Description</div>
                                <div className="flex-1 text-base text-gray-700 font-light">{selectedRecord.course.c_description}</div>
                            </div>
                            <div className="flex border-b border-gray-200 pb-5">
                                <div className="w-48 text-xs text-gray-400 uppercase tracking-widest pt-1">Category</div>
                                <div className="flex-1 text-base text-gray-800 font-light">{selectedRecord.course.c_category}</div>
                            </div>
                            <div className="flex border-b border-gray-200 pb-5">
                                <div className="w-48 text-xs text-gray-400 uppercase tracking-widest pt-1">Duration</div>
                                <div className="flex-1 text-base text-gray-800 font-light">{selectedRecord.course.c_duration} credit</div>
                            </div>
                            <div className="flex border-b border-gray-200 pb-5">
                                <div className="w-48 text-xs text-gray-400 uppercase tracking-widest pt-1">Investment</div>
                                <div className="flex-1 text-2xl font-semibold text-slate-800">RM {selectedRecord.course.c_price}</div>
                            </div>
                            <div className="flex border-b border-gray-200 pb-5">
                                <div className="w-48 text-xs text-gray-400 uppercase tracking-widest pt-1">Application Date</div>
                                <div className="flex-1 text-base text-gray-800 font-light">{new Date(selectedRecord.enrollment_date).toLocaleDateString()}</div>
                            </div>
                        </div>

                        <div className="text-base text-gray-600 p-6 bg-gray-50 border-l-2 border-slate-700 italic font-light leading-relaxed rounded-xl">
                            This document serves as official confirmation of your enrollment approval. Please retain for your records.
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
