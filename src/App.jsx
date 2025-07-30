import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import MainLayout from './MainLayout'
import CommunityHub from './pages/CommunityHub'
import Settings from './pages/Settings'
import Alerts from './pages/sections/Alert/Alerts'
import EditAlerts from './pages/sections/Alert/EditAlerts'
import CCTV from './pages/sections/Alert/CCTV'
import WasteCollection from './pages/sections/Alert/WasteCollection'
import PersonalPayment from './pages/sections/Billing/PersonalPayment'
import PaymentStatus from './pages/sections/Billing/PaymentStatus'
import CollectionReport from './pages/sections/Billing/CollectionReport'
import GeneralComplaints from './pages/sections/Complaints/GeneralComplaints'
import ServiceComplaints from './pages/sections/Complaints/ServiceComplaints'
import Residents from './pages/sections/UserManagement/Residents'
import Vendors from './pages/sections/UserManagement/Vendors'
import AddResidents from './pages/sections/UserManagement/AddResidents'
import EditResidents from './pages/sections/UserManagement/EditResidents'
import AddVendors from './pages/sections/UserManagement/AddVendors'
import EditVendors from './pages/sections/UserManagement/EditVendors'
import { AuthProvider, useAuth } from './AuthContext'
import LoadingSpinner from './components/LoadingSpinner'

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Public Route component (redirects to dashboard if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }
  
  if (isAuthenticated) {
    return <Navigate to="/user-management/residents" replace />;
  }
  
  return children;
};

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <MainLayout>
              <Routes>
                <Route path="/user-management/residents" element={<Residents />} />
                <Route path="/user-management/vendors" element={<Vendors />} />
                <Route path="/user-management/add-resident" element={<AddResidents />} />
                <Route path="/user-management/edit-resident/:id" element={<EditResidents />} />
                <Route path="/user-management/add-vendors" element={<AddVendors />} />
                <Route path="/user-management/edit-vendor/:id" element={<EditVendors />} />
                <Route path="/alerts-security/alerts" element={<Alerts />} />
                <Route path="/alerts-security/edit-alert/:id" element={<EditAlerts />} />
                <Route path="/alerts-security/cctv" element={<CCTV />} />
                <Route path="/alerts-security/waste-collection" element={<WasteCollection />} />
                <Route path="/billing-payment/personal-payment" element={<PersonalPayment />} />
                <Route path="/billing-payment/payment-status" element={<PaymentStatus />} />
                <Route path="/billing-payment/collection-report" element={<CollectionReport />} />
                <Route path="/community-hub" element={<CommunityHub />} />
                <Route path="/complaints/general-complaints" element={<GeneralComplaints />} />
                <Route path="/complaints/service-complaints" element={<ServiceComplaints />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </MainLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
