import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Users,
  BookOpenCheck,
  ClipboardList,
  TrendingUp,
  Target,
  Lightbulb,
} from 'lucide-react';
import Navbar from '../components/NavBar';

const data = [
  { name: 'Jan', students: 400 },
  { name: 'Feb', students: 800 },
  { name: 'Mar', students: 900 },
  { name: 'Apr', students: 700 },
  { name: 'May', students: 1100 },
];

const MotionCard = ({ icon: Icon, title, desc }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileInView={{ opacity: 1, y: 0 }}
    initial={{ opacity: 0, y: 30 }}
    transition={{ duration: 0.6 }}
    className="bg-white border border-yellow-300 rounded-2xl p-6 shadow-md text-center"
  >
    <div className="flex justify-center mb-4">
      <Icon className="h-10 w-10 text-yellow-500" />
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{desc}</p>
  </motion.div>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-gray-50 to-white">
      <Navbar />

      {/* Hero Section with Large Motion Graphic */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="container mx-auto p-6 text-center"
      >
        <motion.h1
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-extrabold text-yellow-600 mb-4"
        >
          Empower Your Learning Journey
        </motion.h1>
        <p className="text-gray-600 text-lg mb-8">
          Join thousands of students excelling with interactive practice tests and real-time performance tracking.
        </p>
        <motion.img
          src="/STL-Logo-250.png"
          alt="Learning Illustration"
          className="mx-auto w-full max-w-3xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        />
      </motion.section>

      {/* Feature Cards */}
      <section className="container mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <MotionCard
          icon={BookOpenCheck}
          title="Practice Tests"
          desc="Unlimited quizzes across multiple subjects and difficulty levels."
        />
        <MotionCard
          icon={ClipboardList}
          title="Instant Results"
          desc="Receive real-time feedback and correct answers after each attempt."
        />
        <MotionCard
          icon={TrendingUp}
          title="Progress Tracking"
          desc="Analyze your improvement with insightful charts and analytics."
        />
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <motion.div
          whileInView={{ scale: 1, opacity: 1 }}
          initial={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white border border-yellow-100 rounded-xl shadow p-6"
        >
          <Users className="mx-auto h-10 w-10 text-yellow-500 mb-2" />
          <h2 className="text-2xl font-bold text-gray-800">12,500+</h2>
          <p className="text-gray-600">Registered Students</p>
        </motion.div>

        <motion.div
          whileInView={{ scale: 1, opacity: 1 }}
          initial={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white border border-yellow-100 rounded-xl shadow p-6"
        >
          <BookOpenCheck className="mx-auto h-10 w-10 text-yellow-500 mb-2" />
          <h2 className="text-2xl font-bold text-gray-800">30,000+</h2>
          <p className="text-gray-600">Exams Completed</p>
        </motion.div>

        <motion.div
          whileInView={{ scale: 1, opacity: 1 }}
          initial={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white border border-yellow-100 rounded-xl shadow p-6"
        >
          <TrendingUp className="mx-auto h-10 w-10 text-yellow-500 mb-2" />
          <h2 className="text-2xl font-bold text-gray-800">95%</h2>
          <p className="text-gray-600">User Satisfaction</p>
        </motion.div>
      </section>

      {/* Chart Section */}
      <section className="container mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Monthly Student Growth</h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white p-6 rounded-xl shadow"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="students" fill="#facc15" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </section>

      {/* Vision & Mission Section */}
      <section className="container mx-auto px-6 py-10 grid md:grid-cols-2 gap-10 items-center">
        <motion.img
          src="/th.jpeg"
          alt="Vision"
          className="w-full h-auto"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        />
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-yellow-600 mb-4">Our Vision</h2>
          <p className="text-gray-700 text-lg mb-4">
            We aim to revolutionize exam preparation by combining modern technology, data-driven insights, and engaging interfaces that inspire every learner to reach their full potential.
          </p>
          <div className="flex gap-4">
            <Target className="h-8 w-8 text-yellow-500" />
            <Lightbulb className="h-8 w-8 text-yellow-500" />
          </div>
        </motion.div>
      </section>
    </div>
  );
}
