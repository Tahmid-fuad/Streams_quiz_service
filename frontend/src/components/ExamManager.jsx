// import { useState, useContext } from 'react';
// import { createExam, addQuestionsToExam } from '../services/api/quiz';
// import { AuthContext } from '../services/context/AuthContext';
// import { QuizContext } from '../services/context/QuizContext';

// const ExamManager = () => {
//     const { user } = useContext(AuthContext);
//     const { fetchExam } = useContext(QuizContext);
//     const [examData, setExamData] = useState({
//         title: '',
//         description: '',
//         duration_minutes: 0,
//     });
//     const [questions, setQuestions] = useState([]);

//     const handleCreateExam = async () => {
//         if (!user) {
//             alert('Please log in to create an exam');
//             return;
//         }
//         try {
//             const response = await createExam(examData);
//             const examId = response._id;
//             alert('Exam created successfully!');
//             if (questions.length > 0) {
//                 await addQuestionsToExam(examId, { questions });
//                 alert('Questions added successfully!');
//                 fetchExam(examId);
//             }
//         } catch (error) {
//             alert('Error creating exam: ' + error.message);
//         }
//     };

//     return (
//         <div>
//             <h2>Create Exam</h2>
//             <input
//                 type="text"
//                 placeholder="Exam Title"
//                 value={examData.title}
//                 onChange={(e) => setExamData({ ...examData, title: e.target.value })}
//             />
//             <input
//                 type="text"
//                 placeholder="Description"
//                 value={examData.description}
//                 onChange={(e) => setExamData({ ...examData, description: e.target.value })}
//             />
//             <input
//                 type="number"
//                 placeholder="Duration (minutes)"
//                 value={examData.duration_minutes}
//                 onChange={(e) => setExamData({ ...examData, duration_minutes: Number(e.target.value) })}
//             />
//             <button onClick={handleCreateExam}>Create Exam</button>
//         </div>
//     );
// };

// export default ExamManager;