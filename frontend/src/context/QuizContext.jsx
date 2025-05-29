import { createContext, useState, useEffect } from "react";
import { getExamDetails } from "../services/api/quiz";

export const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchExam = async (examId) => {
    setLoading(true);
    try {
      const examData = await getExamDetails(examId);
      setExam(examData);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch exam");
      setExam(null);
    } finally {
      setLoading(false);
    }
  };

  const clearExam = () => {
    setExam(null);
    setError(null);
  };

  useEffect(() => {
    // Optionally fetch an exam on mount if needed
  }, []);

  return (
    <QuizContext.Provider value={{ exam, setExam, fetchExam, clearExam, loading, error }}>
      {children}
    </QuizContext.Provider>
  );
};