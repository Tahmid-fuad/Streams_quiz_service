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