import { useEffect, useState } from "react";
import { bookingsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader2, MessageSquare, Calendar, ArrowRight } from "lucide-react";

export default function Chats() {
  const [conversaciones, setConversaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDJ } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversaciones = async () => {
      try {
        const { data } = await bookingsAPI.getAllMyBookings();
        setConversaciones(data);
      } catch (error) {
        console.error("Error cargando chats:", error);
        toast.error("No se pudieron cargar tus conversaciones.");
      } finally {
        setLoading(false);
      }
    };
    fetchConversaciones();
  }, []);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto pb-20 pt-6 px-4 animate-fade-in">
      <div className="mb-8 border-b border-white/10 pb-6">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <MessageSquare className="text-primary" size={32} /> Bandeja de
          Entrada
        </h1>
        <p className="text-gray-400 mt-2">
          Comunícate directamente para coordinar los detalles de tus eventos.
        </p>
      </div>

      {conversaciones.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center border-dashed border-white/10 flex flex-col items-center">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
            <MessageSquare size={32} className="text-gray-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Bandeja vacía</h3>
          <p className="text-gray-400">
            Aún no tienes conversaciones activas. Los chats aparecerán aquí
            cuando tengas reservas.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {conversaciones.map((chat) => {
            // Lógica para saber qué nombre y qué foto mostrar dependiendo de si soy DJ o Cliente
            const nombreChat = isDJ ? chat.nombreCliente : chat.nombreDj;

            // Usamos la foto del backend, o un avatar generado con iniciales si no hay foto
            const fotoChat = isDJ
              ? chat.fotoCliente ||
                `https://ui-avatars.com/api/?name=${chat.nombreCliente}&background=1A1A1A&color=fff&bold=true`
              : chat.fotoDj ||
                `https://ui-avatars.com/api/?name=${chat.nombreDj}&background=1A1A1A&color=fff&bold=true`;

            return (
              <div
                key={chat.id}
                // ✅ Le pasamos el nombre y la foto "escondidos" en el navigates
                onClick={() =>
                  navigate(`/chat/${chat.id}`, {
                    state: {
                      nombre: nombreChat,
                      foto: fotoChat,
                    },
                  })
                }
                className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-primary/50 hover:bg-white/5 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-5">
                  {/* ✅ AVATAR / IMAGEN DE PERFIL */}
                  <div className="relative shrink-0">
                    <img
                      src={fotoChat}
                      alt={`Avatar de ${nombreChat}`}
                      className="w-14 h-14 rounded-full object-cover border-2 border-transparent group-hover:border-primary/50 transition-colors shadow-lg"
                      onError={(e) => {
                        // Si la imagen falla al cargar por lo que sea, ponemos el avatar de iniciales
                        e.target.src = `https://ui-avatars.com/api/?name=${nombreChat}&background=1A1A1A&color=fff&bold=true`;
                      }}
                    />
                    {/* Indicador verde de "Conectado" (Opcional, simulado para dar vida) */}
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[#0a0a0a] rounded-full"></div>
                  </div>

                  {/* Info del Chat */}
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                      {nombreChat}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                      <span className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                        <Calendar size={12} className="text-primary" />{" "}
                        {chat.fecha.split(" ")[0]}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                      <span className="truncate max-w-[150px] sm:max-w-[300px]">
                        {chat.lugar}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Indicador de Acción */}
                <div className="text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0 bg-primary/10 p-2 rounded-full">
                  <ArrowRight size={20} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
