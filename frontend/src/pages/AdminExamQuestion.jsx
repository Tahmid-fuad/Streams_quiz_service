import { useState, useEffect } from "react";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";

export default function AdminExamQuestions() {
  const [mcq, setMcq] = useState({
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correct: "",
  });

  const [subject, setSubject] = useState("");
  const [questionList, setQuestionList] = useState([]);

  useEffect(() => {
    const exam = JSON.parse(localStorage.getItem("currentExam"));
    if (exam?.subject) {
      setSubject(exam.subject);
    } else {
      setSubject("Unknown Subject");
    }
  }, []);

  const handleChange = (e) => {
    setMcq({ ...mcq, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setQuestionList((prev) => [...prev, mcq]);
    alert(`Question added for ${subject}`);
    setMcq({
      question: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correct: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-6 max-w-3xl">
        <div className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6 text-indigo-700 border-b pb-2">
            📝 Add Questions for: <span className="text-indigo-500">{subject}</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-medium mb-1">Question</label>
              <textarea
                name="question"
                value={mcq.question}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 h-20 resize-none"
              />
            </div>

            {["A", "B", "C", "D"].map((opt) => (
              <div key={opt}>
                <label className="block font-medium mb-1">Option {opt}</label>
                <input
                  type="text"
                  name={`option${opt}`}
                  value={mcq[`option${opt}`]}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            ))}

            <div>
              <label className="block font-medium mb-1">Correct Option</label>
              <select
                name="correct"
                value={mcq.correct}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              >
                <option value="" disabled>
                  -- Select Correct Option --
                </option>
                {["A", "B", "C", "D"].map((opt) => (
                  <option key={opt} value={opt}>
                    Option {opt}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
            >
              Add Question
            </button>
          </form>

          {/* Display Added Questions */}
          {questionList.length > 0 && (
            <div className="mt-10">
              <h3 className="text-xl font-semibold text-indigo-600 mb-4">📚 Added Questions</h3>
              <ul className="space-y-4">
                {questionList.map((q, index) => (
                  <li key={index} className="bg-gray-50 p-4 rounded shadow">
                    <p className="font-medium text-gray-800 mb-2">
                      Q{index + 1}: {q.question}
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      <li>A. {q.optionA}</li>
                      <li>B. {q.optionB}</li>
                      <li>C. {q.optionC}</li>
                      <li>D. {q.optionD}</li>
                    </ul>
                    <p className="text-sm mt-2 text-green-600 font-semibold">
                      ✅ Correct Option: {q.correct}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
