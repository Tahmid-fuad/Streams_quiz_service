import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getExamDetails } from "../services/api/quiz";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";

export default function AdminExamDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [exam, setExam] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchExam = async () => {
            try {
                const data = await getExamDetails(id);
                setExam(data);
            } catch (error) {
                setErrorMessage("Error fetching exam details: " + (error.response?.data?.message || error.message));
            }
        };
        fetchExam();
    }, [id]);

    const formatDateTime = (isoDate) => {
        return new Date(isoDate).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    if (!exam) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white text-gray-800 flex flex-col">
                <Navbar />
                <main className="container mx-auto px-4 py-8 flex-grow">
                    <p className="text-center">{errorMessage || "Loading..."}</p>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white text-gray-800 flex flex-col">
            <Navbar />
            <main className="container mx-auto px-4 py-8 flex-grow">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white p-8 rounded-lg shadow mb-8">
                        <h1 className="text-3xl font-bold text-indigo-700 mb-2">{exam.title}</h1>
                        <p className="text-gray-600 mb-4">
                            <strong>Start Time:</strong> {formatDateTime(exam.start_time)}
                        </p>
                        <p className="text-gray-600 mb-4">
                            <strong>Total Score:</strong> {exam.total_score}
                        </p>
                        <button
                            onClick={() => navigate("/admin/exams")}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition font-semibold"
                        >
                            Back to Exams
                        </button>
                    </div>

                    <h2 className="text-2xl font-bold text-indigo-800 mb-6">Questions</h2>
                    {exam.questionIds.length === 0 ? (
                        <p className="text-center text-gray-600">No questions available for this exam.</p>
                    ) : (
                        <div className="space-y-6">
                            {exam.questionIds.map((question, index) => (
                                <div key={question._id} className="bg-white p-6 rounded-lg shadow">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                                {index + 1}. {question.question_text}
                                            </h3>
                                            <ul className="space-y-2">
                                                {question.options.map((option, optIndex) => (
                                                    <li
                                                        key={optIndex}
                                                        className={`p-2 rounded ${question.correctOption === String.fromCharCode(65 + optIndex)
                                                            ? "bg-green-100 text-green-800 font-semibold"
                                                            : "bg-gray-100"
                                                            }`}
                                                    >
                                                        {String.fromCharCode(65 + optIndex)}. {option}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <strong>Score:</strong> {question.score}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}