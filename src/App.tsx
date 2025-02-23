import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Calendar } from './pages/Calendar';
import { Login } from './pages/Login';
import { AuthProvider } from './context/AuthContext';
import { Workouts } from './pages/Workouts'; // Import Workouts

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="workouts" element={<Workouts />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
