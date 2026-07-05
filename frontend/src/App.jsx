import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import MapView from './components/Map/MapView';
import PropertyRegister from './components/Register/PropertyRegister';
import Billing from './components/Billing/Billing';
import AuditBot from './components/Audit/AuditBot';
import Admin from './components/Admin/Admin';
import OwnerPortal from './components/Owner/OwnerPortal';
import Tenants from './components/Tenants/Tenants';
import About from './components/About/About';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AppProvider value={{ user, setUser, isAuthenticated, login, logout }}>
      <BrowserRouter>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0A2A3D',
              color: '#fff',
              borderRadius: '4px',
            },
          }}
        />
        <Routes>
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/" /> : <Login />
          } />
          <Route path="/signup" element={
            isAuthenticated ? <Navigate to="/" /> : <Signup />
          } />
          <Route path="/" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="map" element={<MapView />} />
            <Route path="register" element={<PropertyRegister />} />
            <Route path="billing" element={<Billing />} />
            <Route path="audit" element={<AuditBot />} />
            <Route path="admin" element={<Admin />} />
            <Route path="owner-portal" element={<OwnerPortal />} />
            <Route path="tenants" element={<Tenants />} />
            <Route path="about" element={<About />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;