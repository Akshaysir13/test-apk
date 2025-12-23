// src/App.tsx - UPDATED WITH PROPER ROUTING

import { Routes, Route, Navigate } from 'react-router-dom';
import { TestProvider } from './contexts/TestContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FreeTests from './pages/FreeTests';
import Test from './pages/Test';
import Results from './pages/Results';

function App() {
  return (
    <TestProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/free-tests" element={<FreeTests />} />

        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/test" 
          element={
            <ProtectedRoute>
              <Test />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/results" 
          element={
            <ProtectedRoute>
              <Results />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin Route (if you have admin panel) */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute adminOnly={true}>
              <Test />
            </ProtectedRoute>
          } 
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </TestProvider>
  );
}

export default App;
