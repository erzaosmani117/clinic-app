import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/patient" element={
        <ProtectedRoute role="patient">
          <PatientDashboard />
        </ProtectedRoute>
      } />

      <Route path="/doctor" element={
        <ProtectedRoute role="doctor">
          <DoctorDashboard />
        </ProtectedRoute>
      } />
    </Routes>
  );
}