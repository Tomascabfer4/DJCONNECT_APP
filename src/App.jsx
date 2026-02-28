import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ==========================================
// COMPONENTES Y VISTAS (Páginas de la App)
// ==========================================
import DashboardLayout from "./layouts/DashboardLayout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DJDetail from "./pages/DJDetail";
import Profile from "./pages/Profile";
import MyReservations from "./pages/MyReservations";
import Chats from "./pages/Chats";
import Chat from "./pages/Chat";
import Configuration from "./pages/Configuration";

// ==========================================
// Espera hasta que se haga el logueo, si no loguea manda al login
// ==========================================
const ProtectedRoute = ({ children }) => {
  const { usuario, cargando } = useAuth();
  if (cargando) return null;
  if (!usuario) return <Navigate to="/login" />;
  return children;
};

// ==========================================
// Si ya estas logueado, te manda al dashboard
// ==========================================
const PublicRoute = ({ children }) => {
  const { usuario } = useAuth();
  if (usuario) return <Navigate to="/dashboard" />;
  return children;
};

function App() {
  return (
    // BrowserRouter habilita la navegación de "Single Page Application" (sin recargar la web)
    <BrowserRouter>
      {/* Envolvemos con AuthProvider para que cualquier componente pueda acceder a 'useAuth()' */}
      <AuthProvider>
        <Routes>
          {/* ==========================================
              RUTAS PÚBLICAS (Para usuarios sin sesión)
              ========================================== */}
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

          {/* ==========================================
              RUTAS PRIVADAS (Solo usuarios registrados)
              Envuelto en el DashboardLayout para que tenga el menú lateral
              ========================================== */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* Todas estas rutas se inyectan en el <Outlet /> del DashboardLayout */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/perfil" element={<Profile />} />
            <Route path="/reservas" element={<MyReservations />} />
            <Route path="/chats" element={<Chats />} />
            <Route path="/chat/:reservaId" element={<Chat />} />
            <Route path="/configuracion" element={<Configuration />} />
            <Route path="/dj/:id" element={<DJDetail />} />
          </Route>

          {/* ==========================================
              Para devolver al inicio de la app si se introduce una URL que no existe
              ========================================== */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        {/* Para poder lanzar un toast desde cualquier componente */}
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
