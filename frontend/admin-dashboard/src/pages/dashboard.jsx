import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend,
} from "recharts";

const examResults = [
  { name: "Math", score: 85 },
  { name: "Science", score: 78 },
  { name: "History", score: 92 },
  { name: "English", score: 88 },
  { name: "Art", score: 95 },
];

const correctAnswersData = [
  { name: "Math", correct: 42 },
  { name: "Science", correct: 39 },
  { name: "History", correct: 46 },
  { name: "English", correct: 44 },
  { name: "Art", correct: 48 },
];

const studyTimeData = [
  { name: "Math", hours: 12 },
  { name: "Science", hours: 10 },
  { name: "History", hours: 8 },
  { name: "English", hours: 11 },
  { name: "Art", hours: 7 },
];

const pieColors = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#3b82f6"];

function Navbar() {
  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <img src="/STL-Logo-250.png" alt="Logo" className="h-10 w-100" />
        <span className="text-xl font-bold">EduStream</span>
      </div>
      <div className="space-x-6 hidden md:flex">
        <a href="/dashboard" className="text-indigo-600 font-semibold">
          Dashboard
        </a>
        <a href="/exams" className="text-gray-700 hover:text-indigo-600">
          Exams
        </a>
        <a href="/profile" className="text-gray-700 hover:text-indigo-600">
          Profile
        </a>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-white border-t mt-12 shadow-inner">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-700">
        {/* Brand */}
        <div>
          <h2 className="text-xl font-bold text-indigo-600">EduStream</h2>
          <p className="mt-2 text-sm text-gray-600">
            Empowering students with insightful tools for academic success.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <a href="/dashboard" className="hover:text-indigo-600 transition">
                Dashboard
              </a>
            </li>
            <li>
              <a href="/exams" className="hover:text-indigo-600 transition">
                Exams
              </a>
            </li>
            <li>
              <a href="/profile" className="hover:text-indigo-600 transition">
                Profile
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-indigo-600 transition">
                Support
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
          <p className="text-sm">Email: support@edustream.com</p>
          <p className="text-sm">Phone: +1 (800) 123-4567</p>
          <p className="text-sm mt-2">123 Learning Lane, EduCity, 98765</p>
        </div>
      </div>
    </footer>
  );
}

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col">
      <Navbar />

      <main className="container mx-auto p-6 mt-6 bg-white rounded-lg shadow flex-grow">
        {/* Correct Answers Bar Chart */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4">
            Correct Answers per Subject
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={correctAnswersData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="correct" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Study Time Bar Chart */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4">
            Time Spent Studying (hrs)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={studyTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="hours" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Score Distribution Pie Chart */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4">Score Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={examResults}
                dataKey="score"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {examResults.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={pieColors[index % pieColors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Trend Area Chart */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Performance Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={examResults}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorScore)"
              />
              <Legend />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </main>

      <Footer />
    </div>
  );
}
