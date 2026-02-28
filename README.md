# DJ Connect - Frontend (React + Vite) 🎧

**DJ Connect** es la plataforma número uno para eventos, diseñada para conectar a los mejores DJs con organizadores y amantes de la música, sin intermediarios.

Este repositorio contiene el código de la aplicación frontend, desarrollada con **React**, **Vite**, y **Tailwind CSS**. A continuación, se detalla la arquitectura de la aplicación, el flujo de datos, y cómo se interconectan las distintas piezas del proyecto.

---

## 🏗 Arquitectura y Estructura del Proyecto

El proyecto sigue una arquitectura modular y orientada a componentes. La estructura principal está dentro de la carpeta `src/`:

- **`src/context/`**: Manejo del estado global (Autenticación).
- **`src/services/`**: Comunicación centralizada con la API Backend (C#).
- **`src/layouts/`**: Componentes estructurales que envuelven las vistas.
- **`src/pages/`**: Vistas completas a las que el usuario navega (Páginas).
- **`src/components/`**: Pequeñas piezas de interfaz reutilizables.

---

## 🔗 Cómo se Interconectan los Elementos

### 1. El Núcleo y Rutas (`App.jsx`)

`App.jsx` es el corazón de la aplicación.

- Envuelve toda la aplicación con el proveedor `<AuthProvider>`, lo que significa que cualquier componente en el proyecto puede saber si hay un usuario logueado o no.
- Define el enrutamiento (`React Router DOM`). Dependiendo del estado del usuario, te permite acceder a **Rutas Públicas** (`/`, `/login`, `/registro`) o te redirige al login si intentas acceder a **Rutas Privadas** (`/dashboard`, `/perfil`, etc.).

### 2. Estado Global (`AuthContext.jsx`)

Maneja toda la lógica de sesión del usuario.

- Mantiene las variables de estado `usuario`, `token` (guardado en `localStorage`) y `cargando`.
- Exporta el hook personalizado `useAuth()`. Cuando una página (ej. `Dashboard.jsx`) necesita saber el nombre del usuario o si `esDJ`, llama a este hook.
- Controla las acciones de autenticación llamando a los servicios (`apiAutenticacion`): `iniciarSesion`, `registrarUsuario`, y `cerrarSesion`.

### 3. La Estructura Privada (`DashboardLayout.jsx` y `Sidebar.jsx`)

Cuando un usuario ingresa a una ruta privada, se renderiza el `DashboardLayout`:

- Este componente renderiza el **menú de navegación lateral** (`Sidebar.jsx`).
- El `Sidebar` lee el contexto para mostrar la foto del usuario y decidir qué botones mostrar (ej: "Mi Panel" si `esDJ` frente a "Explorar DJs" si no lo es).
- Deja un espacio dinámico (`<Outlet />`) donde React inyecta la página que el usuario quiere ver (`Dashboard`, `Mis Reservas`, etc.).

### 4. Las Vistas y Componentes (`pages/` y `components/`)

- Las **Páginas** (`Profile.jsx`, `Dashboard.jsx`, etc.) son las encargadas de la "Lógica de Negocio" visual. Al montarse en la pantalla (usando `useEffect`), hacen peticiones a los servicios (`api.js`) para obtener datos (Stats, Portfolio, Listados).
- Una vez obtenidos los datos, las páginas los pasan (a través de _Props_) a los **Componentes** (como `DJCard.jsx`) para que estos solo se ocupen de dibujar la información de manera bonita (Dumb Components).

---

## 🔌 Servicios y Endpoints (`api.js`)

Toda la comunicación con el Backend ocurre a través de **Instancias de Axios** configuradas en `src/services/api.js`. Esta configuración inyecta automáticamente el token de seguridad (`Bearer Token`) en cada petición que se hace al servidor.

Los endpoints están divididos de forma semántica en objetos exportados:

### `apiAutenticacion`

- `iniciarSesion`: Recibe credenciales y devuelve el JWT Token.
- `registrarCliente` / `registrarDj`: Crea nuevos usuarios.
- `obtenerUsuarioActual`: Trae los datos básicos del usuario actualmente logueado.
- `actualizarPerfil`, `subirFoto`: Modifican la información de la cuenta.

### `apiDjs`

- `obtenerTodos`: Lista pública de DJs.
- `buscar`: Recibe parámetros dinámicos (nombre, género, ciudad, precio) para filtrar resultados en el dashboard cliente.
- `obtenerPorId`: Devuelve la ficha pública detallada del DJ (Usado en `DJDetail`).
- `actualizarPerfilDj`: Actualiza los datos extendsion (precio hora, géneros, bio).

### `apiReservas`

- `crear`: Permite al cliente proponer una fecha, hora y duración a un DJ.
- `obtenerMisReservas`: Trae la bandeja de entrada de reservas tanto para DJs (quienes aprueban) como para Clientes.
- `actualizarEstado`: El DJ cambia la reserva a `Aceptada` o `Rechazada`.

### `apiPortafolio`

- Permite subir archivos multimedia (`subir`) definiendo el "tipo" (_imagen_, _video_, _musica_).
- `obtenerPorDj`: Carga la galería pública cuando un usuario ve la ficha de un DJ.

### `apiEstadisticas`

- `obtenerDashboard`: Resume el número de eventos pendientes, total de ingresos, bolos confirmados y valoración media para pintar en el Dashboard panel del DJ.

### `apiValoraciones`

- Permite al cliente `crear` un comentario con estrellas (`Puntaje 1-5`) tras haber terminado una reserva.
- Carga las reviews de un perfil en la vista `obtenerPorDj`.

---

## 🚀 Cómo Empezar Localmente

1. Clona el repositorio e ingresa a su directorio.
2. Instala las dependencias de Node:
   ```bash
   npm install
   ```
3. Levanta el servidor de desarrollo de Vite:
   ```bash
   npm run dev
   ```
4. Abre `http://localhost:5173/` en tu navegador.
