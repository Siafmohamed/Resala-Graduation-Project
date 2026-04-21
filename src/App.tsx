import { BrowserRouter as Router } from'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuthLogoutListener, useAuthStore } from './features/authentication';
import { ErrorBoundary } from './shared/components/feedback/ErrorBoundary';
import { FullPageSpinner } from './features/authentication/components/FullPageSpinner';
import { AuthProvider } from './features/authentication/context/AuthProvider';
import AppRoutes from './routes/AppRoutes';
import './App.css';

/**
 * Session logout listener and initialization for staff portal.
 * Listens for session-expired events and initializes auth state on mount.
 */
function AuthBootstrap({ children }: { children: React.ReactNode }) {
  useAuthLogoutListener();
  const isLoading = useAuthStore((s: any) => s.isLoading);
  
  if (isLoading) {
    return <FullPageSpinner />;
  }

  return (
    <>
      {children}
     <ToastContainer
       position="top-right"
       autoClose={3000}
       hideProgressBar={false}
       newestOnTop
       closeOnClick
       rtl={true}
       pauseOnFocusLoss
       draggable
       pauseOnHover
       theme="light"
     />
   </>
 );
}

function App() {
return (
  <ErrorBoundary>
    <AuthProvider>
      <Router>
        <AuthBootstrap>
          <AppRoutes />
        </AuthBootstrap>
      </Router>
    </AuthProvider>
  </ErrorBoundary>
);
}

export default App;
