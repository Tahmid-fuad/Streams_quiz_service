import { quizAxiosInstance } from '../axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const createExam = async (examData) => {
  const response = await quizAxiosInstance.post(API_ENDPOINTS.CREATE_EXAM, examData);
  return response.data;
};

export const addQuestionsToExam = async (examId, questionsData) => {
  const response = await quizAxiosInstance.post(API_ENDPOINTS.ADD_QUESTIONS(examId), questionsData);
  return response.data;
};

export const getExamDetails = async (examId) => {
  const response = await quizAxiosInstance.get(API_ENDPOINTS.GET_EXAM(examId));
  return response.data;
};

export const getAllExams = async () => {
  const response = await quizAxiosInstance.get(API_ENDPOINTS.GET_ALL_EXAMS);
  return response.data;
};

export const updateExam = async (examId, examData) => {
  const response = await quizAxiosInstance.put(API_ENDPOINTS.UPDATE_EXAM(examId), examData);
  return response.data;
};

export const deleteExam = async (examId) => {
  const response = await quizAxiosInstance.delete(API_ENDPOINTS.DELETE_EXAM(examId));
  return response.data;
};

export const updateQuestion = async (examId, questionId, questionData) => {
  const response = await quizAxiosInstance.put(API_ENDPOINTS.UPDATE_QUESTION(examId, questionId), questionData);
  return response.data;
};

export const deleteQuestion = async (examId, questionId) => {
  const response = await quizAxiosInstance.delete(API_ENDPOINTS.DELETE_QUESTION(examId, questionId));
  return response.data;
};

export const getAllStudentExams = async () => {
  const response = await quizAxiosInstance.get(API_ENDPOINTS.GET_ALL_STUDENT_EXAMS);
  return response.data;
};

export const getStudentExamDetails = async (examId) => {
  const response = await quizAxiosInstance.get(API_ENDPOINTS.GET_STUDENT_EXAM(examId));
  return response.data;
};

