import { submissionAxiosInstance } from "../axiosInstance";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export const submitExam = async (examId, submissionData) => {
  const response = await submissionAxiosInstance.post(API_ENDPOINTS.SUBMIT_EXAM(examId), submissionData);
  return response.data;
};