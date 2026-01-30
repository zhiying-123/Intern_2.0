// Subject Management Page
import { getAllSubjects, getSubjectStats } from "./m_subject";
import SubjectManagementUI from "./m_subjectUI";

export default async function SubjectManagementPage() {
    const subjectsResult = await getAllSubjects();
    const statsResult = await getSubjectStats();

    if (!subjectsResult.success) {
        return (
            <div className="bg-red-50 rounded-3xl p-8 text-center">
                <div className="text-6xl mb-4">❌</div>
                <p className="text-red-900 font-bold text-xl">Error loading subjects</p>
                <p className="text-red-700">{subjectsResult.message}</p>
            </div>
        );
    }

    return (
        <div>
            {/* Stats Banner */}
            {statsResult.success && statsResult.data && (
                <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-linear-to-br from-blue-100 to-blue-200 rounded-2xl p-6 shadow-md">
                        <p className="text-blue-800 text-sm font-medium">Total Subjects</p>
                        <p className="text-4xl font-bold text-blue-900">{statsResult.data.totalSubjects}</p>
                    </div>
                    <div className="bg-linear-to-br from-green-100 to-green-200 rounded-2xl p-6 shadow-md">
                        <p className="text-green-800 text-sm font-medium">In Use</p>
                        <p className="text-4xl font-bold text-green-900">{statsResult.data.subjectsInUse}</p>
                    </div>
                    <div className="bg-linear-to-br from-gray-100 to-gray-200 rounded-2xl p-6 shadow-md">
                        <p className="text-gray-800 text-sm font-medium">Unused</p>
                        <p className="text-4xl font-bold text-gray-900">{statsResult.data.unusedSubjects}</p>
                    </div>
                </div>
            )}

            <SubjectManagementUI subjects={subjectsResult.data || []} />
        </div>
    );
}
