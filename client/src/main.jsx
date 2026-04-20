import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { ToastProvider } from './components/Toast.jsx';
import './i18n';
import './index.css';

// Lazy-loaded pages — only loaded when the user navigates to them
const Home = lazy(() => import('./pages/Home.jsx'));
const Tools = lazy(() => import('./pages/Tools.jsx'));
const ToolPage = lazy(() => import('./pages/ToolPage.jsx'));
const MetadataPage = lazy(() => import('./pages/MetadataPage.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const Pricing = lazy(() => import('./pages/Pricing.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));
const ApiDocs = lazy(() => import('./pages/ApiDocs.jsx'));
const Profile = lazy(() => import('./pages/Profile.jsx'));
const Settings = lazy(() => import('./pages/Settings.jsx'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword.jsx'));
const ResetPassword = lazy(() => import('./pages/ResetPassword.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const Faq = lazy(() => import('./pages/Faq.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Terms = lazy(() => import('./pages/Terms.jsx'));
const Privacy = lazy(() => import('./pages/Privacy.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

function Loading() {
  return <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>Loading...</div>;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
    <ToastProvider>
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route element={<App />}>
          <Route index element={<Home />} />
          <Route path="tools" element={<Tools />} />
          <Route path="tools/view-metadata" element={<ProtectedRoute><MetadataPage /></ProtectedRoute>} />
          <Route path="tools/:toolName" element={<ProtectedRoute><ToolPage /></ProtectedRoute>} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="api-docs" element={<ApiDocs />} />
          <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="contact" element={<Contact />} />
          <Route path="faq" element={<Faq />} />
          <Route path="about" element={<About />} />
          <Route path="terms" element={<Terms />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      </Suspense>
    </BrowserRouter>
    </ToastProvider>
    </HelmetProvider>
  </React.StrictMode>
);
