import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addQuestionsToExam, getExamDetails, updateQuestion, deleteQuestion } from "../services/api/quiz";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";

export default function AdminExamDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [exam, setExam] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [newQuestion, setNewQuestion] = useState({
        question_text: "",
        options: ["", "", "", ""],
        correctOption: "",
        score: "",
    });
    const [editQuestion, setEditQuestion] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [questionToDelete, setQuestionToDelete] = useState(null);

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

    const handleQuestionChange = (e, index) => {
        const { name, value } = e.target;
        if (name === "options") {
            const updatedOptions = [...newQuestion.options];
            updatedOptions[index] = value;
            setNewQuestion({ ...newQuestion, options: updatedOptions });
        } else {
            setNewQuestion({ ...newQuestion, [name]: value });
        }
    };

    const handleAddQuestion = async (e) => {
        e.preventDefault();
        if (!user) {
            setErrorMessage("Please log in to add questions");
            return;
        }
        if (
            !newQuestion.question_text ||
            !newQuestion.correctOption ||
            !newQuestion.score ||
            newQuestion.options.some((opt) => !opt)
        ) {
            setErrorMessage("Please fill all fields in the question form");
            return;
        }
        try {
            const questionData = {
                questions: [{ ...newQuestion, score: Number(newQuestion.score) }],
            };
            await addQuestionsToExam(id, questionData);
            const updatedExam = await getExamDetails(id); // Refetch to sync
            setExam(updatedExam);
            setNewQuestion({
                question_text: "",
                options: ["", "", "", ""],
                correctOption: "",
                score: "",
            });
            setSuccessMessage("Question added successfully!");
            setErrorMessage("");
        } catch (error) {
            setErrorMessage("Error adding question: " + (error.response?.data?.message || error.message));
        }
    };

    const handleEditChange = (e, index) => {
        const { name, value } = e.target;
        if (name === "options") {
            const newOptions = [...editQuestion.options];
            newOptions[index] = value;
            setEditQuestion({ ...editQuestion, options: newOptions });
        } else {
            setEditQuestion({ ...editQuestion, [name]: value });
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const questionData = {
                question_text: editQuestion.question_text,
                options: editQuestion.options,
                correctOption: editQuestion.correctOption,
                score: Number(editQuestion.score),
            };
            await updateQuestion(id, editQuestion._id, questionData);
            const updatedExam = await getExamDetails(id); // Refetch to sync
            setExam(updatedExam);
            setSuccessMessage("Question updated successfully!");
            setShowEditModal(false);
        } catch (error) {
            setErrorMessage("Error updating question: " + (error.response?.data?.message || error.message));
        }
    };

    const handleDeleteQuestion = (questionId) => {
        setQuestionToDelete(questionId);
        setShowDeleteModal(true);
    };

    const confirmDeleteQuestion = async () => {
        try {
            await deleteQuestion(id, questionToDelete);
            const updatedExam = await getExamDetails(id); // Refetch to sync
            setExam(updatedExam);
            setSuccessMessage("Question deleted successfully!");
        } catch (error) {
            setErrorMessage("Error deleting question: " + (error.response?.data?.message || error.message));
        }
        setShowDeleteModal(false);
        setQuestionToDelete(null);
    };

    const openEditModal = (question) => {
        setEditQuestion({
            _id: question._id,
            question_text: question.question_text,
            options: [...question.options],
            correctOption: question.correctOption,
            score: question.score,
        });
        setShowEditModal(true);
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

                    <div className="bg-white p-8 rounded-lg shadow mb-8">
                        <h2 className="text-2xl font-bold text-indigo-700 mb-6">Add New Question</h2>
                        <form onSubmit={handleAddQuestion} className="space-y-5">
                            <div>
                                <label className="block font-medium mb-1">Question Text</label>
                                <input
                                    type="text"
                                    name="question_text"
                                    value={newQuestion.question_text}
                                    onChange={handleQuestionChange}
                                    required
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            {[0, 1, 2, 3].map((index) => (
                                <div key={index}>
                                    <label className="block font-medium mb-1">Option {String.fromCharCode(65 + index)}</label>
                                    <input
                                        type="text"
                                        name="options"
                                        value={newQuestion.options[index]}
                                        onChange={(e) => handleQuestionChange(e, index)}
                                        required
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>
                            ))}
                            <div>
                                <label className="block font-medium mb-1">Correct Option</label>
                                <select
                                    name="correctOption"
                                    value={newQuestion.correctOption}
                                    onChange={handleQuestionChange}
                                    required
                                    className="w-full border rounded px-3 py-2"
                                >
                                    <option value="">Select correct option</option>
                                    {newQuestion.options.map((opt, index) => (
                                        <option key={index} value={String.fromCharCode(65 + index)}>
                                            {String.fromCharCode(65 + index)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block font-medium mb-1">Score</label>
                                <input
                                    type="number"
                                    name="score"
                                    value={newQuestion.score}
                                    onChange={handleQuestionChange}
                                    required
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
                            >
                                Add Question
                            </button>
                            {successMessage && (
                                <p className="text-green-500 text-sm text-center mb-4">{successMessage}</p>
                            )}
                            {errorMessage && (
                                <p className="text-red-500 text-sm text-center mb-4">{errorMessage}</p>
                            )}

                        </form>
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
                                        <div className="flex flex-col items-end gap-2">
                                            <div className="text-sm text-gray-600">
                                                <strong>Score:</strong> {question.score}
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => openEditModal(question)}
                                                    className="bg-yellow-600 hover:bg-yellow-700 text-white py-1 px-3 rounded-lg transition"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteQuestion(question._id)}
                                                    className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-lg transition"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {showEditModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                                <h2 className="text-2xl font-bold mb-6 text-indigo-700">Edit Question</h2>
                                <form onSubmit={handleEditSubmit} className="space-y-5">
                                    <div>
                                        <label className="block font-medium mb-1">Question Text</label>
                                        <input
                                            type="text"
                                            name="question_text"
                                            value={editQuestion.question_text}
                                            onChange={(e) => handleEditChange(e)}
                                            required
                                            className="w-full border rounded px-3 py-2"
                                        />
                                    </div>
                                    {[0, 1, 2, 3].map((index) => (
                                        <div key={index}>
                                            <label className="block font-medium mb-1">Option {String.fromCharCode(65 + index)}</label>
                                            <input
                                                type="text"
                                                name="options"
                                                value={editQuestion.options[index]}
                                                onChange={(e) => handleEditChange(e, index)}
                                                required
                                                className="w-full border rounded px-3 py-2"
                                            />
                                        </div>
                                    ))}
                                    <div>
                                        <label className="block font-medium mb-1">Correct Option</label>
                                        <select
                                            name="correctOption"
                                            value={editQuestion.correctOption}
                                            onChange={(e) => handleEditChange(e)}
                                            required
                                            className="w-full border rounded px-3 py-2"
                                        >
                                            <option value="">Select correct option</option>
                                            {editQuestion.options.map((opt, index) => (
                                                <option key={index} value={String.fromCharCode(65 + index)}>
                                                    {String.fromCharCode(65 + index)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block font-medium mb-1">Score</label>
                                        <input
                                            type="number"
                                            name="score"
                                            value={editQuestion.score}
                                            onChange={(e) => handleEditChange(e)}
                                            required
                                            className="w-full border rounded px-3 py-2"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            type="submit"
                                            className="flex-1 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
                                        >
                                            Save Changes
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowEditModal(false)}
                                            className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {showDeleteModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                                <h2 className="text-xl font-bold mb-4 text-indigo-700">Are you sure?</h2>
                                <p className="text-gray-600 mb-6">Do you want to delete this question? This action cannot be undone.</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={confirmDeleteQuestion}
                                        className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowDeleteModal(false);
                                            setQuestionToDelete(null);
                                        }}
                                        className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}