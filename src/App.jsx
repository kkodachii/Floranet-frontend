import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './Login'
import ForgotPassword from './ForgotPassword'
import DashboardLayout from './DashboardLayout'
import UserManagement from './pages/UserManagement'
import AlertsSecurity from './pages/AlertsSecurity'
import BillingPayment from './pages/BillingPayment'
import CommunityHub from './pages/CommunityHub'
import Complaints from './pages/Complaints'
import Settings from './pages/Settings'
import Help from './pages/Help'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot" element={<ForgotPassword />} />

        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<UserManagement />} />
          <Route path="user-management" element={<UserManagement />} />
          <Route path="alerts-security" element={<AlertsSecurity />} />
          <Route path="billing-payment" element={<BillingPayment />} />
          <Route path="community-hub" element={<CommunityHub />} />
          <Route path="complaints" element={<Complaints />} />
          <Route path="settings" element={<Settings />} />
          <Route path="help" element={<Help />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
