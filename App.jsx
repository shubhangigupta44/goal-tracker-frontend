import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import Sidebar from './components/Sidebar';
import useAuthStore from './store/useAuthStore';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
};

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuthStore();
  return (
    <div className="flex min-h-screen w-full bg-muted/20">
      <Sidebar />
      <div className="flex flex-col w-full">
        <header className="sticky top-0 flex h-14 lg:h-[60px] items-center gap-4 border-b bg-background px-6 z-10 justify-between">
          <div className="md:hidden font-semibold">GoalTracker Pro</div>
          <div className="hidden md:block"></div>
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium">{user?.name} <span className="text-muted-foreground">({user?.role})</span></div>
            <button onClick={logout} className="text-sm font-medium text-destructive hover:underline">Logout</button>
          </div>
        </header>
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  const { user } = useAuthStore();
  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout>
              {user?.role === 'Manager' ? <Navigate to="/team" replace /> : <EmployeeDashboard />}
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/team" element={
          <ProtectedRoute roles={['Manager', 'Admin']}>
            <DashboardLayout>
              <ManagerDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}
