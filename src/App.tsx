import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import { Calendar } from './pages/Calendar';
import { Login } from './pages/Login';
import { AuthProvider } from './context/AuthContext';
import { Workouts } from './pages/Workouts';
import { Nutrition } from './pages/Nutrition'; // Import the new Nutrition component

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          {/* Layout wraps only the authenticated routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="workouts" element={<Workouts />} />
            <Route path="nutrition" element={<Nutrition />} /> {/* Add the new route */}
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
