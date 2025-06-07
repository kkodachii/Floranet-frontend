import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
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
      <DashboardLayout>
        <Routes>
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/alerts-security" element={<AlertsSecurity />} />
          <Route path="/billing-payment" element={<BillingPayment />} />
          <Route path="/community-hub" element={<CommunityHub />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<Help />} />
          <Route path="/" element={<UserManagement />} />
        </Routes>
      </DashboardLayout>
    </Router>
  )
}

export default App
