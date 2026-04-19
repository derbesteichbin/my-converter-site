import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx';
import Home from './pages/Home.jsx';
import Tools from './pages/Tools.jsx';
import ToolPage from './pages/ToolPage.jsx';
import MetadataPage from './pages/MetadataPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Pricing from './pages/Pricing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ApiDocs from './pages/ApiDocs.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { ToastProvider } from './components/Toast.jsx';
import './i18n';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
    <ToastProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<App />}>
          <Route index element={<Home />} />
          <Route path="tools" element={<Tools />} />
          <Route path="tools/view-metadata" element={<ProtectedRoute><MetadataPage /></ProtectedRoute>} />
          <Route path="tools/:toolName" element={<ProtectedRoute><ToolPage /></ProtectedRoute>} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="api-docs" element={<ApiDocs />} />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
    </ToastProvider>
    </HelmetProvider>
  </React.StrictMode>
);
