import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Layouts & Pages
import DashboardLayout from "./layouts/DashboardLayout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DJDetail from "./pages/DJDetail";
import Profile from "./pages/Profile";
import MyReservations from "./pages/MyReservations"; // Asegúrate de importar esto si lo tienes
import Chats from "./pages/Chats";
import Chat from "./pages/Chat";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rutas Públicas */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Landing />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/registro"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Rutas Privadas */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/perfil" element={<Profile />} />
            {/* Si ya creamos MyReservations, úsala aquí. Si no, déjalo como el div que tenías */}
            <Route path="/reservas" element={<MyReservations />} />
            <Route path="/chats" element={<Chats />} />
            <Route path="/chat/:reservaId" element={<Chat />} />
            <Route path="/dj/:id" element={<DJDetail />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        <ToastContainer
          position="bottom-right"
          theme="dark"
          toastClassName="glass-panel"
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
