import { BrowserRouter as Router } from 'react-router-dom';
import { useInitializeAuth, useAuthLogoutListener } from './features/authentication';
import { ErrorBoundary } from './shared/components/feedback/ErrorBoundary';
import AppRoutes from './routes/AppRoutes';
import './App.css';

/**
 * Runs auth initialization and session listeners once at app mount.
 * Must be inside QueryClientProvider (see main.tsx).
 */
function AuthBootstrap({ children }: { children: React.ReactNode }) {
  useInitializeAuth();
  useAuthLogoutListener();
  return <>{children}</>;
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