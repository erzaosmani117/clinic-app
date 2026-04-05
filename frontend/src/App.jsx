import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import DosageHome from './pages/DosageHome';
import DosageDrugList from './pages/DosageDrugList';
import DosageCalculator from './pages/DosageCalculator';
import DosageHistory from './pages/DosageHistory';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
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

      <Route path="/dosage" element={
        <ProtectedRoute role="doctor">
          <DosageHome />
        </ProtectedRoute>
      } />

      <Route path="/dosage/category/:id" element={
        <ProtectedRoute role="doctor">
          <DosageDrugList />
        </ProtectedRoute>
      } />

      <Route path="/dosage/drug/:id" element={
        <ProtectedRoute role="doctor">
          <DosageCalculator />
        </ProtectedRoute>
      } />

      <Route path="/dosage/history" element={
        <ProtectedRoute role="doctor">
          <DosageHistory />
        </ProtectedRoute>
      } />
    </Routes>
  );
}