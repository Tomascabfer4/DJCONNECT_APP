import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom"; // ✅ Añadido useLocation
import { apiChat } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { toast } from "react-toastify";
import { Send, ArrowLeft, Loader2, MessageSquare } from "lucide-react";

export default function Chat() {
  const { reservaId } = useParams();
  const navegar = useNavigate();
  const { usuario } = useAuth();

  // Obtenemos los datos (nombre y foto) que le pasamos desde Chats.jsx
  const location = useLocation();
  const datosChat = location.state || {}; // Si alguien recarga la página F5, esto será un objeto vacío

  // Nombres de fallback por si recargan la página directamente en la URL
  const nombreDestino = datosChat.nombre || `Reserva #${reservaId}`;
  const fotoDestino =
    datosChat.foto ||
    `https://ui-avatars.com/api/?name=${nombreDestino}&background=1A1A1A&color=fff&bold=true`;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [cargando, setCargando] = useState(true);
  const [connection, setConnection] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    let newConnection = null;

    const setupChat = async () => {
      try {
        const { data } = await apiChat.obtenerHistorial(reservaId);
        setMessages(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error historial:", error);
        setMessages([]);
      } finally {
        setCargando(false);
      }

      const token = localStorage.getItem("token");

      newConnection = new HubConnectionBuilder()
        .withUrl("https://djconnect-api.onrender.com/chathub", {
          accessTokenFactory: () => token,
        })
        .configureLogging(LogLevel.Information)
        .withAutomaticReconnect()
        .build();

      setConnection(newConnection);
    };

    setupChat();

    return () => {
      if (newConnection) {
        newConnection.stop();
      }
    };
  }, [reservaId]);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log(" Conectado a SignalR");
          connection
            .invoke("UnirseAlGrupo", reservaId.toString())
            .catch((err) => console.error("Error al unirse al grupo:", err));

          connection.on("RecibirMensaje", (mensaje) => {
            setMessages((prev) => {
              if (prev.some((m) => m.id === mensaje.id)) return prev;
              return [
                ...prev,
                {
                  id: mensaje.id,
                  contenido: mensaje.contenido,
                  fechaEnvio: mensaje.fechaEnvio,
                  emisorNombre: mensaje.emisorNombre,
                  esMio: mensaje.emisorId === usuario?.id,
                },
              ];
            });
          });
        })
        .catch((e) => {
          console.error("🔴 Error conexión SignalR:", e);
        });
    }
  }, [connection, reservaId, usuario?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await apiChat.enviarMensaje({
        reservaId: parseInt(reservaId),
        contenido: newMessage,
      });
      setNewMessage("");
    } catch (error) {
      console.error(error);
      toast.error("Error al enviar mensaje");
    }
  };

  if (cargando)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-100px)] flex flex-col pb-4 px-4 animate-fade-in">
      {/* CABECERA REDISEÑADA CON FOTO Y NOMBRE */}
      <div className="flex items-center gap-4 py-4 border-b border-white/10 mb-4 bg-[#0a0a0a]/80 backdrop-blur-md rounded-2xl px-6 sticky top-0 z-10 mt-4 shadow-lg">
        <button
          onClick={() => navegar(-1)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={24} />
        </button>

        <div className="flex items-center gap-4">
          {/* Foto del chat */}
          <div className="relative shrink-0">
            <img
              src={fotoDestino}
              alt={nombreDestino}
              className="w-12 h-12 rounded-full object-cover border border-white/10"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${nombreDestino}&background=1A1A1A&color=fff&bold=true`;
              }}
            />
            {/* Indicador verde de "Conectado" */}
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0a0a0a] rounded-full"></div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">
              {nombreDestino}
            </h2>
            <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5 font-medium uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              En línea
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-20 opacity-50 flex flex-col items-center">
            <MessageSquare size={48} className="mb-4 opacity-50" />
            <p className="text-lg font-bold text-white">
              No hay mensajes todavía.
            </p>
            <p className="text-sm">
              Escribe un mensaje para empezar a coordinar el evento.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.esMio ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[80%] md:max-w-[60%] px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-lg ${msg.esMio ? "bg-primary text-white rounded-br-none" : "glass-panel bg-white/10 text-gray-200 rounded-bl-none border border-white/10"}`}
            >
              {msg.contenido}
            </div>
            <span className="text-[10px] text-gray-500 mt-1 px-2 font-medium">
              {msg.esMio ? "Tú" : msg.emisorNombre} •{" "}
              {new Date(msg.fechaEnvio).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="relative mt-auto">
        <input
          type="text"
          className="w-full bg-black/40 glass-panel border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 focus:outline-none placeholder-gray-500 shadow-xl"
          placeholder="Escribe tu mensaje aquí..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-primary/20 text-primary rounded-xl hover:bg-primary hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary/20 disabled:hover:text-primary"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
