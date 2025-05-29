import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { addQuestionsToExam, getExamDetails, updateQuestion, deleteQuestion } from "../services/api/quiz";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";

export default function AdminExamQuestions() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const examId = localStorage.getItem("currentExamId");
  const [questions, setQuestions] = useState([]);
  const [forms, setForms] = useState([
    {
      id: 0,
      question_text: "",
      options: ["", "", "", ""],
      correctOption: "",
      score: "",
    },
  ]);
  const [exam, setExam] = useState(null);
  const [editQuestion, setEditQuestion] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!examId) {
      return; 
    }

    const fetchExam = async () => {
      try {
        const response = await getExamDetails(examId);
        setExam(response.data);
        setErrorMessage("");
      } catch (error) {
        setErrorMessage("Error fetching exam: " + (error.response?.data?.message || error.message));
      }
    };

    fetchExam();
  }, [examId]);

  const handleQuestionChange = (e, formId, index) => {
    const updatedForms = [...forms];
    if (e.target.name === "options") {
      updatedForms[formId].options[index] = e.target.value;
    } else {
      updatedForms[formId][e.target.name] = e.target.value;
    }
    setForms(updatedForms);
  };

  const handleAddQuestion = (e) => {
    e.preventDefault();
    const lastForm = forms[forms.length - 1];
    if (
      !lastForm.question_text ||
      !lastForm.correctOption ||
      !lastForm.score ||
      lastForm.options.some((opt) => !opt)
    ) {
      setErrorMessage("Please fill all fields in the current question form");
      return;
    }
    setQuestions([...questions, { ...lastForm, options: [...lastForm.options] }]);
    setForms([
      ...forms,
      {
        id: forms.length,
        question_text: "",
        options: ["", "", "", ""],
        correctOption: "",
        score: "",
      },
    ]);
    setErrorMessage("");
    setSuccessMessage("Question added to list! New form opened.");
  };

  const handleSubmitQuestions = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!user) {
      setErrorMessage("Please log in to submit questions");
      return;
    }

    if (!examId) {
      setErrorMessage("No exam selected. Please create an exam first.");
      return;
    }

    // Prepare a combined list of questions
    const combinedQuestions = [...questions];

    const lastForm = forms[forms.length - 1];

    // Validate and include the last unsubmitted form
    const isLastFormValid =
      lastForm &&
      lastForm.question_text &&
      lastForm.correctOption &&
      lastForm.score &&
      lastForm.options.every((opt) => opt);

    if (isLastFormValid) {
      combinedQuestions.push({ ...lastForm, options: [...lastForm.options] });
    }

    if (combinedQuestions.length === 0) {
      setErrorMessage("Please add at least one question");
      return;
    }

    try {
      const questionsData = {
        questions: combinedQuestions.map((q) => ({ ...q, score: Number(q.score) })),
      };
      await addQuestionsToExam(examId, questionsData);
      localStorage.removeItem("currentExamId");
      navigate("/admin/exams");
    } catch (error) {
      setErrorMessage(
        "Error submitting questions: " + (error.response?.data?.message || error.message)
      );
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
      await updateQuestion(examId, editQuestion._id, questionData);
      setExam({
        ...exam,
        questionIds: exam.questionIds.map((q) =>
          q._id === editQuestion._id ? { ...q, ...questionData } : q
        ),
      });
      setSuccessMessage("Question updated successfully!");
      setShowEditModal(false);
    } catch (error) {
      setErrorMessage("Error updating question: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    try {
      await deleteQuestion(examId, questionId);
      setExam({
        ...exam,
        questionIds: exam.questionIds.filter((q) => q._id !== questionId),
      });
      setSuccessMessage("Question deleted successfully!");
    } catch (error) {
      setErrorMessage("Error deleting question: " + (error.response?.data?.message || error.message));
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white text-gray-800 flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <section className="mb-12 max-w-xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6 text-indigo-700 border-b pb-2">
              🗂️ Add Exam Questions
            </h2>

            {exam && (
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4">Existing Questions</h3>
                {exam.questionIds?.length === 0 ? (
                  <p className="text-gray-600">No questions added yet.</p>
                ) : (
                  <div className="space-y-4">
                    {exam.questionIds?.map((question) => (
                      <div key={question._id} className="bg-gray-100 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold">{question.question_text}</p>
                            <ul className="text-sm text-gray-600">
                              {question.options.map((opt, i) => (
                                <li key={i}>{String.fromCharCode(65 + i)}. {opt}</li>
                              ))}
                            </ul>
                            <p className="text-sm">
                              Correct: {
                                question.options && question.correctOption
                                  ? String.fromCharCode(65 + question.options.findIndex(opt => opt === question.correctOption))
                                  : ""
                              }
                            </p>
                            <p className="text-sm">Score: {question.score}</p>
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
                    ))}
                  </div>
                )}
              </div>
            )}

            {forms.map((form, formId) => (
              <form key={formId} onSubmit={handleAddQuestion} className="space-y-5 mb-6">
                <h3 className="text-lg font-semibold">Question {formId + 1}</h3>
                <div>
                  <label className="block font-medium mb-1">Question Text</label>
                  <input
                    type="text"
                    name="question_text"
                    value={form.question_text}
                    onChange={(e) => handleQuestionChange(e, formId)}
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
                      value={form.options[index]}
                      onChange={(e) => handleQuestionChange(e, formId, index)}
                      required
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                ))}
                <div>
                  <label className="block font-medium mb-1">Correct Option</label>
                  <select
                    name="correctOption"
                    value={
                      form.options.findIndex((opt) => opt === form.correctOption) !== -1
                        ? String.fromCharCode(65 + form.options.findIndex((opt) => opt === form.correctOption))
                        : ""
                    }
                    onChange={(e) => {
                      const selectedIndex = e.target.value.charCodeAt(0) - 65;
                      const selectedValue = form.options[selectedIndex];
                      handleQuestionChange(
                        { target: { name: "correctOption", value: selectedValue } },
                        formId
                      );
                    }}
                    required
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Select correct option</option>
                    {form.options.map((opt, index) => (
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
                    value={form.score}
                    onChange={(e) => handleQuestionChange(e, formId)}
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
              </form>
            ))}
            <div className="mt-6">
              <h3 className="text-lg font-bold mb-4">Added Questions ({questions.length})</h3>
              <ul className="space-y-2">
                {questions.map((q, index) => (
                  <li key={index} className="text-sm bg-gray-100 p-2 rounded">
                    {q.question_text} (Score: {q.score})
                  </li>
                ))}
              </ul>
              <button
                onClick={handleSubmitQuestions}
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition mt-4"
              >
                Submit All Questions
              </button>
              {successMessage && (
                <p className="text-green-500 text-sm text-center mb-4">{successMessage}</p>
              )}
              {errorMessage && (
                <p className="text-red-500 text-sm text-center mb-4">{errorMessage}</p>
              )}
            </div>
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
                        value={
                          editQuestion.options.findIndex((opt) => opt === editQuestion.correctOption) !== -1
                            ? String.fromCharCode(65 + editQuestion.options.findIndex((opt) => opt === editQuestion.correctOption))
                            : ""
                        }
                        onChange={(e) => {
                          const selectedIndex = e.target.value.charCodeAt(0) - 65;
                          const selectedValue = editQuestion.options[selectedIndex];
                          handleEditChange({
                            target: { name: "correctOption", value: selectedValue }
                          });
                        }}
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
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}