import React from'react';
import { Routes, Route, Navigate } from'react-router-dom';
import { ProtectedRoute, Role, useAuthGuard } from '../features/authentication';

// Authentication pages
import LoginPage from '../features/authentication/components/pages/LoginPage';
import ForgotPasswordPage from '../features/authentication/components/pages/ForgotPasswordPage';
import OTPPage from '../features/authentication/components/pages/OTPPage';
import ResetPasswordPage from '../features/authentication/components/pages/ResetPasswordPage';

import AdminDashboard from '../features/authentication/components/pages/AdminDashboard';
import ReceptionDashboard from '../features/authentication/components/pages/ReceptionDashboard';

// Core feature pages
import { DonorsPage, AddDonorPage, DonorDetailPage } from '../features/donors';
import  DashboardPage  from '../features/dashboard/components/DashboardPage';
import { RegisterDonationPage } from '../features/donations/components/RegisterDonationPage';
import { InKindDonationsListPage } from '../features/donations/components/InKindDonationsListPage';
import { NotificationsPage } from '../features/notifications/components/NotificationsPage';
import { SettingsPage } from '../features/settings/components/SettingsPage';

// Reception & donor management
import SponsorshipManagementAPI from '../features/SponsorshipCases/components/SponsorshipManagementAPI';
import { ReceiptVerificationPage } from '../features/ReceiptVerification/components/ReceiptVerificationPage';
import { RepresentativeOrdersPage } from '../features/RepresentativeOrders/components/RepresentativeOrdersPage';
import { UrgentCasesPage } from '../features/UrgentCases/components/UrgentCasesPage';
import { BranchPaymentsPage } from '../features/BranchPayments/components/BranchPaymentsPage';
import { RegisterNewDonorPage } from '../features/RegisterNewDonor/components/RegisterNewDonorPage';
import { ReceptionSettingsPage } from '../features/authentication/components/pages/ReceptionSettingsPage';

// Forms
import { FormsDashboardPage } from '../features/formsDashboard/components/FormsDashboardPage';

// Admin
import { AccountManagementPage } from '../features/AccountManagement/components/AccountManagementPage';
import { ReportsPage } from '../features/AdminReports/components/ReportsPage';
import { AdminAnalyticsPage } from '../features/Adminanalytics/components/AdminAnalyticsPage';
import { ComplaintsPage } from '../features/complaints/components/ComplaintsPage';
import { RepresentativesPage } from '../features/representatives/components/RepresentativesPage';

// Layout
import MainLayout from '../shared/components/layout/MainLayout';

const RootRedirect: React.FC = () => {
  const { isAuthenticated, userRole } = useAuthGuard();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Intelligently redirect based on role
  if (userRole === Role.ADMIN) {
    return <Navigate to="/admin-dashboard" replace />;
  }
  if (userRole === Role.RECEPTIONIST) {
    return <Navigate to="/reception-dashboard" replace />;
  }
  
  return <Navigate to="/dashboard" replace />;
};

const AppRoutes: React.FC = () => {
 return (
   <Routes>
      {/* Root redirect */}
     <Route path="/" element={<RootRedirect />} />
     
     <Route path="/login" element={<LoginPage />} />
     <Route path="/forgot-password" element={<ForgotPasswordPage />} />
     <Route path="/verify-otp" element={<OTPPage />} />
     <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Shared Staff routes (accessible to both Receptionist and Admin, but not public) */}
      <Route
        element={
          <ProtectedRoute redirectTo="/login">
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/donors" element={<DonorsPage />} />
        <Route path="/donors/:id" element={<DonorDetailPage />} />
        <Route path="/add-donor" element={<AddDonorPage />} />
        <Route path="/donations" element={<RegisterDonationPage />} />
      </Route>

      {/* Receptionist-only routes */}
      <Route
        element={
          <ProtectedRoute redirectTo="/login" requiredRole={Role.RECEPTIONIST}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/reception-dashboard" element={<ReceptionDashboard />} />
        <Route path="/sponsorships" element={<SponsorshipManagementAPI />} />
        <Route path="/receipt-verification" element={<ReceiptVerificationPage />} />
        <Route path="/representative-orders" element={<RepresentativeOrdersPage />} />
        <Route path="/urgent-cases" element={<UrgentCasesPage />} />
        <Route path="/branch-payments" element={<BranchPaymentsPage />} />
        <Route path="/register-new-donor" element={<RegisterNewDonorPage />} />
        <Route path="/in-kind-donations" element={<InKindDonationsListPage />} />
        <Route path="/reception-settings" element={<ReceptionSettingsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/donation-details/:id" element={<ReceptionDashboard />} />
      </Route>

      {/* Unauthorized page */}
      <Route
        path="/unauthorized"
        element={
          <div dir="rtl" className="flex min-h-screen items-center justify-center bg-slate-50">
            <div className="rounded-lg border bg-white px-8 py-6 text-center shadow-sm">
              <h1 className="mb-2 text-xl font-bold text-slate-900">غير مصرح لك بالوصول</h1>
              <p className="text-sm text-muted-foreground">
                ليس لديك الصلاحيات الكافية لعرض هذه الصفحة. يرجى مراجعة مسؤول النظام.
              </p>
            </div>
          </div>
        }
      />

      {/* Form manager + Admin routes */}
      <Route
        element={
          <ProtectedRoute redirectTo="/login" requiredRole={Role.FORM_MANAGER}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/forms-dashboard" element={<FormsDashboardPage />} />
      </Route>

      {/* Admin-only routes */}
      <Route
        element={
          <ProtectedRoute redirectTo="/login" requiredRole={Role.ADMIN}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/account-management" element={<AccountManagementPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/admin-analytics" element={<AdminAnalyticsPage />} />
        <Route path="/complaints" element={<ComplaintsPage />} />
        <Route path="/representatives" element={<RepresentativesPage />} />
      </Route>

      {/* Fallback for any other path: redirect to root which will intelligently redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
