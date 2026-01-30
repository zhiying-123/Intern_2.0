// Enrollment Management Page
import { getPendingEnrollments, getEnrollmentStats } from "./m_enroll";
import EnrollmentManagementUI from "./m_enrollUI";

export default async function EnrollmentManagementPage() {
    const result = await getPendingEnrollments();
    const statsResult = await getEnrollmentStats();

    if (!result.success) {
        return (
            <div className="bg-red-50 rounded-3xl p-8 text-center">
                <div className="text-6xl mb-4">❌</div>
                <p className="text-red-900 font-bold text-xl">Error loading enrollments</p>
                <p className="text-red-700">{result.message}</p>
            </div>
        );
    }

    return (
        <div>
            {/* Stats Banner */}
            {statsResult.success && statsResult.data && (
                <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-linear-to-br from-yellow-100 to-yellow-200 rounded-2xl p-6 shadow-md">
                        <p className="text-yellow-800 text-sm font-medium">Pending</p>
                        <p className="text-4xl font-bold text-yellow-900">{statsResult.data.pending}</p>
                    </div>
                    <div className="bg-linear-to-br from-green-100 to-green-200 rounded-2xl p-6 shadow-md">
                        <p className="text-green-800 text-sm font-medium">Approved</p>
                        <p className="text-4xl font-bold text-green-900">{statsResult.data.approved}</p>
                    </div>
                    <div className="bg-linear-to-br from-red-100 to-red-200 rounded-2xl p-6 shadow-md">
                        <p className="text-red-800 text-sm font-medium">Disapproved</p>
                        <p className="text-4xl font-bold text-red-900">{statsResult.data.disapproved}</p>
                    </div>
                    <div className="bg-linear-to-br from-blue-100 to-blue-200 rounded-2xl p-6 shadow-md">
                        <p className="text-blue-800 text-sm font-medium">Total</p>
                        <p className="text-4xl font-bold text-blue-900">{statsResult.data.total}</p>
                    </div>
                </div>
            )}

            <EnrollmentManagementUI enrollments={result.data || []} />
        </div>
    );
}
