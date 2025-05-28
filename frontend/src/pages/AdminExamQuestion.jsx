import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { addQuestionsToExam } from "../services/api/quiz";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";

export default function AdminExamQuestions() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
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
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
    setQuestions([...questions, lastForm]);
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
    if (!user) {
      setErrorMessage("Please log in to submit questions");
      return;
    }
    if (questions.length === 0) {
      setErrorMessage("Please add at least one question");
      return;
    }
    const examId = localStorage.getItem("currentExamId");
    if (!examId) {
      setErrorMessage("No exam selected. Please create an exam first.");
      return;
    }
    try {
      const questionsData = {
        questions: questions.map((q) => ({ ...q, score: Number(q.score) })),
      };
      await addQuestionsToExam(examId, questionsData);
      setSuccessMessage("Questions submitted successfully!");
      localStorage.removeItem("currentExamId");
      setTimeout(() => {
        navigate("/admin/exams");
      }, 1500);
    } catch (error) {
      setErrorMessage(
        "Error submitting questions: " +
          (error.response?.data?.message || error.message)
      );
    }
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
            {successMessage && (
              <p className="text-green-500 text-sm text-center mb-4">
                {successMessage}
              </p>
            )}
            {errorMessage && (
              <p className="text-red-500 text-sm text-center mb-4">
                {errorMessage}
              </p>
            )}
            {forms.map((form, formId) => (
              <form
                key={formId}
                onSubmit={handleAddQuestion}
                className="space-y-5 mb-6"
              >
                <h3 className="text-lg font-semibold">
                  Question {formId + 1}
                </h3>
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
                    <label className="block font-medium mb-1">
                      Option {String.fromCharCode(65 + index)}
                    </label>
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
                    value={form.correctOption}
                    onChange={(e) => handleQuestionChange(e, formId)}
                    required
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Select correct option</option>
                    {form.options.map((opt, index) => (
                      <option
                        key={index}
                        value={String.fromCharCode(65 + index)}
                      >
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
                {formId === forms.length - 1 && (
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
                  >
                    Add Question
                  </button>
                )}
              </form>
            ))}
            {questions.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-bold mb-4">
                  Added Questions ({questions.length})
                </h3>
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
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}