import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, Role } from '../features/authentication';

// Authentication pages
import LoginPage from '../features/authentication/components/pages/LoginPage';
import RegisterPage from '../features/authentication/components/pages/RegisterPage';
import ForgotPasswordPage from '../features/authentication/components/pages/ForgotPasswordPage';
import OTPPage from '../features/authentication/components/pages/OTPPage';
import ResetPasswordPage from '../features/authentication/components/pages/ResetPasswordPage';

// Core feature pages
import { DonorsPage, AddDonorPage, DonorDetailPage } from '../features/donors';
import { DashboardPage } from '../features/dashboard/components/DashboardPage';
import { RegisterDonationPage } from '../features/donations/components/RegisterDonationPage';
import { NotificationsPage } from '../features/notifications/components/NotificationsPage';
import { SettingsPage } from '../features/settings/components/SettingsPage';

// Reception & donor management
import { SponsorshipManagementPage } from '../features/SponsorshipCases/components/SponsorshipManagementPage';
import { ReceiptVerificationPage } from '../features/ReceiptVerification/components/ReceiptVerificationPage';
import { RepresentativeOrdersPage } from '../features/RepresentativeOrders/components/RepresentativeOrdersPage';
import { UrgentCasesPage } from '../features/UrgentCases/components/UrgentCasesPage';
import { BranchPaymentsPage } from '../features/BranchPayments/components/BranchPaymentsPage';
import { RegisterNewDonorPage } from '../features/RegisterNewDonor/components/RegisterNewDonorPage';

// Forms
import { FormsDashboardPage } from '../features/formsDashboard/components/FormsDashboardPage';

// Admin
import { AccountManagementPage } from '../features/AccountManagement/components/AccountManagementPage';
import { AdminReportsPage } from '../features/AdminReports/components/AdminReportsPage';
import { AdminAnalyticsPage } from '../features/Adminanalytics/components/AdminAnalyticsPage';
import { ComplaintsPage } from '../features/complaints/components/ComplaintsPage';
import { RepresentativesPage } from '../features/representatives/components/RepresentativesPage';

// Layout
import MainLayout from '../shared/components/layout/MainLayout';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public auth routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/verify-otp" element={<OTPPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

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

      {/* Protected routes — أي مستخدم مصرح له بالدخول */}
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

      {/* Receptionist + Admin routes */}
      <Route
        element={
          <ProtectedRoute redirectTo="/login" requiredRole={Role.RECEPTIONIST}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/sponsorship-cases" element={<SponsorshipManagementPage />} />
        <Route path="/receipt-verification" element={<ReceiptVerificationPage />} />
        <Route path="/representative-orders" element={<RepresentativeOrdersPage />} />
        <Route path="/urgent-cases" element={<UrgentCasesPage />} />
        <Route path="/branch-payments" element={<BranchPaymentsPage />} />
        <Route path="/register-new-donor" element={<RegisterNewDonorPage />} />
      </Route>

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
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/account-management" element={<AccountManagementPage />} />
        <Route path="/admin-reports" element={<AdminReportsPage />} />
        <Route path="/admin-analytics" element={<AdminAnalyticsPage />} />
        <Route path="/complaints" element={<ComplaintsPage />} />
        <Route path="/representatives" element={<RepresentativesPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
