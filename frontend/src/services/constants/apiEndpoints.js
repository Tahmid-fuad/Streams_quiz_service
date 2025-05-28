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
};