import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import MainLayout from './MainLayout'
import CommunityHub from './pages/CommunityHub'
import Settings from './pages/Settings'
import Alerts from './pages/sections/Alert/Alerts'
import CCTV from './pages/sections/Alert/CCTV'
import WasteCollection from './pages/sections/Alert/WasteCollection'
import PersonalPayment from './pages/sections/Billing/PersonalPayment'
import PaymentStatus from './pages/sections/Billing/PaymentStatus'
import CollectionReport from './pages/sections/Billing/CollectionReport'
import GeneralComplaints from './pages/sections/Complaints/GeneralComplaints'
import ServiceComplaints from './pages/sections/Complaints/ServiceComplaints'
import Residents from './pages/sections/UserManagement/Residents'
import Vendors from './pages/sections/UserManagement/Vendors'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/*" element={
          <MainLayout>
            <Routes>
              <Route path="/user-management/residents" element={<Residents />} />
              <Route path="/user-management/vendors" element={<Vendors />} />
              <Route path="/alerts-security/alerts" element={<Alerts />} />
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
        } />
      </Routes>
    </Router>
  );
}

export default App;
