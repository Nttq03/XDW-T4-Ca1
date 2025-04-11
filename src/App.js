import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import GiangVienDashboard from './components/GiangVienDashboard';
import SinhVienDashboard from './components/SinhVienDashboard';

// Protected Route component
const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role'); // Get role from localStorage
  if (!token || userRole !== role) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="Admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/giangvien"
            element={
              <ProtectedRoute role="GiangVien">
                <GiangVienDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sinhvien"
            element={
              <ProtectedRoute role="SinhVien">
                <SinhVienDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
