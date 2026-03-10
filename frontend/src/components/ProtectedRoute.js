import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Spinner = () => (
  <div style={{ minHeight: "100vh", background: "#080c14", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{ width: 40, height: 40, border: "3px solid rgba(79,70,229,0.3)", borderTopColor: "#4f46e5", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  return user ? children : <Navigate to="/login" replace />;
};

export const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "ADMIN") return <Navigate to="/dashboard" replace />;
  return children;
};
