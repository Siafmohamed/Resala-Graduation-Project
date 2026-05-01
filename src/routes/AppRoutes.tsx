import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, PublicRoute, Role, useAuthGuard } from '../features/authentication';
import { LoadingSpinner } from '@/shared/components/feedback/LoadingSpinner';

// Authentication pages
const LoginPage = lazy(() => import('../features/authentication/components/pages/LoginPage'));
const ForgotPasswordPage = lazy(() => import('../features/authentication/components/pages/ForgotPasswordPage'));
const OTPPage = lazy(() => import('../features/authentication/components/pages/OTPPage'));
const ResetPasswordPage = lazy(() => import('../features/authentication/components/pages/ResetPasswordPage'));

const AdminDashboard = lazy(() => import('../features/authentication/components/pages/AdminDashboard'));
const ReceptionDashboard = lazy(() => import('../features/authentication/components/pages/ReceptionDashboard'));

// Core feature pages
const DonorsPage = lazy(() => import('../features/donors').then(m => ({ default: m.DonorsPage })));
const AddDonorPage = lazy(() => import('../features/donors').then(m => ({ default: m.AddDonorPage })));
const DonorDetailPage = lazy(() => import('../features/donors').then(m => ({ default: m.DonorDetailPage })));
const DashboardPage = lazy(() => import('../features/dashboard/components/DashboardPage'));
const RegisterDonationPage = lazy(() => import('../features/donations/components/RegisterDonationPage').then(m => ({ default: m.RegisterDonationPage })));
const InKindDonationsListPage = lazy(() => import('../features/donations/components/InKindDonationsListPage').then(m => ({ default: m.InKindDonationsListPage })));
const NotificationsPage = lazy(() => import('../features/notifications/components/NotificationsPage').then(m => ({ default: m.NotificationsPage })));
const SettingsPage = lazy(() => import('../features/settings/components/SettingsPage').then(m => ({ default: m.SettingsPage })));

// Reception & donor management
const SponsorshipManagementAPI = lazy(() => import('../features/SponsorshipCases/components/SponsorshipManagementAPI'));
const ReceiptVerificationPage = lazy(() => import('../features/ReceiptVerification/components/ReceiptVerificationPage').then(m => ({ default: m.ReceiptVerificationPage })));
const RepresentativeOrdersPage = lazy(() => import('../features/RepresentativeOrders/components/RepresentativeOrdersPage').then(m => ({ default: m.RepresentativeOrdersPage })));
const UrgentCasesPage = lazy(() => import('../features/UrgentCases/components/UrgentCasesPage').then(m => ({ default: m.UrgentCasesPage })));
const BranchPaymentsPage = lazy(() => import('../features/BranchPayments/components/BranchPaymentsPage').then(m => ({ default: m.BranchPaymentsPage })));
const RegisterNewDonorPage = lazy(() => import('../features/RegisterNewDonor/components/RegisterNewDonorPage').then(m => ({ default: m.RegisterNewDonorPage })));
const ReceptionSettingsPage = lazy(() => import('../features/authentication/components/pages/ReceptionSettingsPage').then(m => ({ default: m.ReceptionSettingsPage })));
const EmergencyPaymentsDashboard = lazy(() => import('../features/EmergencyPayments/components/EmergencyPaymentsDashboard'));
const EmergencyPaymentDetails = lazy(() => import('../features/EmergencyPayments/components/EmergencyPaymentDetails'));
const PaymentDetailsPage = lazy(() => import('../features/PendingPayments/components/PaymentDetailsPage')); // New import

// Forms
const FormsDashboardPage = lazy(() => import('../features/formsDashboard/components/FormsDashboardPage').then(m => ({ default: m.FormsDashboardPage })));

// Admin
const AccountManagementPage = lazy(() => import('../features/AccountManagement/components/AccountManagementPage').then(m => ({ default: m.AccountManagementPage })));
const ReportsPage = lazy(() => import('../features/AdminReports/components/ReportsPage').then(m => ({ default: m.ReportsPage })));
const AdminAnalyticsPage = lazy(() => import('../features/Adminanalytics/components/AdminAnalyticsPage').then(m => ({ default: m.AdminAnalyticsPage })));
const ComplaintsPage = lazy(() => import('../features/complaints/components/ComplaintsPage').then(m => ({ default: m.ComplaintsPage })));
const RepresentativesPage = lazy(() => import('../features/representatives/components/RepresentativesPage').then(m => ({ default: m.RepresentativesPage })));

// Layout
const MainLayout = lazy(() => import('../shared/components/layout/MainLayout'));

const FullPageLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-50">
    <LoadingSpinner message="جاري التحميل..." />
  </div>
);

const RootRedirect: React.FC = () => {
  const { isAuthenticated, isInitialized, userRole } = useAuthGuard();

  // Wait for auth to resolve before redirecting
  if (!isInitialized) {
    return <FullPageLoader />;
  }

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
   <Suspense fallback={<FullPageLoader />}>
     <Routes>
        {/* Root redirect */}
       <Route path="/" element={<RootRedirect />} />
       <Route path="/login" element={
  <PublicRoute>
    <LoginPage />
  </PublicRoute>
} />

<Route path="/forgot-password" element={
  <PublicRoute>
    <ForgotPasswordPage />
  </PublicRoute>
} />

<Route path="/verify-otp" element={
  <PublicRoute>
    <OTPPage />
  </PublicRoute>
} />

<Route path="/reset-password" element={
  <PublicRoute>
    <ResetPasswordPage />
  </PublicRoute>
} />

        {/* Shared Staff routes (accessible to both Receptionist and Admin) */}
        <Route
          element={
            <ProtectedRoute redirectTo="/login">
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>

        {/* Receptionist-only routes (including donors list) */}
        <Route
          element={
            <ProtectedRoute redirectTo="/login" requiredRole={Role.RECEPTIONIST}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/reception-dashboard" element={<ReceptionDashboard />} />
          <Route path="/donors" element={<DonorsPage />} />
          <Route path="/donors/:id" element={<DonorDetailPage />} />
          <Route path="/add-donor" element={<AddDonorPage />} />
          <Route path="/receipt-verification" element={<ReceiptVerificationPage />} />
          <Route path="/representative-orders" element={<RepresentativeOrdersPage />} />
          <Route path="/branch-payments" element={<BranchPaymentsPage />} />
          <Route path="/register-new-donor" element={<RegisterNewDonorPage />} />
          <Route path="/in-kind-donations" element={<InKindDonationsListPage />} />
          {/* /donations is the legacy create-donation URL still used in sidebar */}
          <Route path="/donations" element={<RegisterDonationPage />} />
          <Route path="/in-kind-donations/new" element={<RegisterDonationPage />} />
          <Route path="/in-kind-donations/edit/:id" element={<RegisterDonationPage />} />
          <Route path="/reception-settings" element={<ReceptionSettingsPage />} />
          <Route path="/emergency-payments" element={<EmergencyPaymentsDashboard />} />
          <Route path="/emergency-payments/:id" element={<EmergencyPaymentDetails />} />
          <Route path="/payment-details/:paymentId" element={<PaymentDetailsPage />} />
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
          <Route path="/sponsorships" element={<SponsorshipManagementAPI />} />
          <Route path="/urgent-cases" element={<UrgentCasesPage />} />
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
    </Suspense>
  );
};

export default AppRoutes;
