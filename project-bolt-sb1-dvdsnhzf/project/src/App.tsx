import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Pages
import LoginPage from './pages/auth/LoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import WelcomePage from './pages/welcome/WelcomePage';
import AttendanceManagementPage from './pages/attendance/AttendanceManagementPage';
import AddAttendancePage from './pages/attendance/AddAttendancePage';
import AttendanceReportPage from './pages/attendance/AttendanceReportPage';
// Import removed due to missing file
import OrganizationPage from './pages/organization/OrganizationPage';
import DesignationPage from './pages/organization/DesignationPage';
import StatusPage from './pages/organization/StatusPage';
import EmployeePage from './pages/employee/EmployeePage';
import AddEmployeePage from './pages/employee/AddEmployeePage';
import Layout from './components/layout/Layout';

// Auth Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      
      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<WelcomePage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        
        {/* Attendance Routes */}
        <Route path="attendance">
          <Route index element={<AttendanceManagementPage />} />
          <Route path="add" element={<AddAttendancePage />} />
          <Route path="edit/:id" element={<AddAttendancePage />} />
          <Route path="report" element={<AttendanceReportPage />} />
          {/* Route removed due to missing component */}
        </Route>
        
        {/* Organization Routes */}
        <Route path="organization">
          <Route index element={<OrganizationPage />} />
          <Route path="designations" element={<DesignationPage />} />
          <Route path="status" element={<StatusPage />} />
        </Route>
        
        {/* Employee Routes */}
        <Route path="employee">
          <Route index element={<EmployeePage />} />
          <Route path="add" element={<AddEmployeePage />} />
          <Route path="edit/:id" element={<AddEmployeePage />} />
        </Route>
      </Route>
      
      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;