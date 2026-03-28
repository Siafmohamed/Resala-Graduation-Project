import { BrowserRouter as Router } from'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuthLogoutListener } from './features/authentication';
import { ErrorBoundary } from './shared/components/feedback/ErrorBoundary';
import AppRoutes from './routes/AppRoutes';
import './App.css';

/**
 * Session logout listener for staff portal.
 * Listens for session-expired events and clears auth state.
 */
function AuthBootstrap({ children }: { children: React.ReactNode }) {
useAuthLogoutListener();
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
    <Router>
      <AuthBootstrap>
        <AppRoutes />
      </AuthBootstrap>
    </Router>
  </ErrorBoundary>
);
}

export default App;
