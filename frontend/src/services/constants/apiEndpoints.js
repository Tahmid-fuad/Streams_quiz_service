export const API_ENDPOINTS = {
  LOGIN: "/login",
  SIGNUP: "/register",
  PROFILE: "/profile",
  ROLE: "/role",
  CHANGE_NAME: "/change_name",
  CHANGE_EMAIL: "/change_email",
  SWITCH_ROLE: "/switch_role",
  CHANGE_PASS: "/change_password",

  CREATE_EXAM: "/admin/exams",
  ADD_QUESTIONS: (examId) => `/admin/exams/${examId}/questions/bulk`,
  GET_EXAM: (examId) => `/admin/exams/${examId}`,
  GET_ALL_EXAMS: "/admin/exams",
  UPDATE_EXAM: (examId) => `/admin/exams/${examId}`,
  DELETE_EXAM: (examId) => `/admin/exams/${examId}`,
  UPDATE_QUESTION: (examId, questionId) => `/admin/exams/${examId}/questions/${questionId}`,
  DELETE_QUESTION: (examId, questionId) => `/admin/exams/${examId}/questions/${questionId}`,

  GET_ALL_STUDENT_EXAMS: "/exams",
  GET_STUDENT_EXAM: (examId) => `/exams/${examId}`,

  SUBMIT_EXAM: (examId) => `/submissions/${examId}`,
};