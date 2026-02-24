import { useEffect, useState } from "react";
import { bookingsAPI, reviewsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Loader2,
  Calendar,
  MapPin,
  Clock,
  MessageSquare,
  CheckCircle,
  XCircle,
  Star,
} from "lucide-react";

// HELPER: Convertir fecha
const parseDate = (dateStr) => {
  if (!dateStr) return new Date();
  if (dateStr.includes("/")) {
    const [datePart, timePart] = dateStr.split(" ");
    if (datePart && timePart) {
      const [day, month, year] = datePart.split("/");
      const [hour, minute] = timePart.split(":");
      return new Date(year, month - 1, day, hour, minute);
    }
  }
  return new Date(dateStr);
};

export default function MyReservations() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDJ } = useAuth();
  const navigate = useNavigate();

  // ESTADOS PARA EL MODAL DE VALORACIÓN
  const [reviewModal, setReviewModal] = useState({
    open: false,
    reservaId: null,
    djName: "",
  });
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comentario, setComentario] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Guardamos en memoria las reservas que acabamos de valorar para ocultar el botón
  const [ratedReservas, setRatedReservas] = useState([]);

  const fetchReservas = async () => {
    try {
      const { data } = await bookingsAPI.getAllMyBookings();
      setReservas(data);
    } catch (error) {
      console.error("Error cargando reservas:", error);
      toast.error("No se pudieron cargar las reservas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservas();
  }, []);

  const handleUpdateStatus = async (id, nuevoEstado) => {
    try {
      await bookingsAPI.updateStatus(id, nuevoEstado);
      toast.success(`Reserva ${nuevoEstado.toLowerCase()} con éxito`);
      fetchReservas();
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      toast.error("Error al cambiar el estado de la reserva");
    }
  };

  // ENVIAR LA VALORACIÓN AL BACKEND
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await reviewsAPI.create({
        reservaId: reviewModal.reservaId,
        puntuacion: rating,
        comentario: comentario,
      });
      toast.success("¡Gracias! Tu valoración ha sido publicada.");

      // Añadimos el ID a la lista local para ocultar el botón instantáneamente
      setRatedReservas((prev) => [...prev, reviewModal.reservaId]);

      // Cerramos y limpiamos el modal
      setReviewModal({ open: false, reservaId: null, djName: "" });
      setRating(5);
      setComentario("");
    } catch (error) {
      const errorMsg =
        error.response?.data?.mensaje ||
        error.response?.data ||
        "Error al enviar la valoración";
      toast.error(errorMsg);

      if (
        typeof errorMsg === "string" &&
        errorMsg.includes("ya ha sido valorada")
      ) {
        setRatedReservas((prev) => [...prev, reviewModal.reservaId]);
        setReviewModal({ open: false, reservaId: null, djName: "" });
      }
    } finally {
      setSubmittingReview(false);
    }
  };

  const getStatusColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case "aceptada":
      case "finalizada":
        return "text-green-400 bg-green-500/10 border-green-500/20";
      case "rechazada":
        return "text-red-400 bg-red-500/10 border-red-500/20";
      default:
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
    }
  };

  const formatRangoHoras = (fechaCompleta, horasStr) => {
    if (!fechaCompleta) return "";
    try {
      const horaInicio = fechaCompleta.split(" ")[1];
      if (!horaInicio) return "";
      const horasASumar = parseInt(horasStr) || 1;
      const [h, m] = horaInicio.split(":");
      const fechaTemp = new Date();
      fechaTemp.setHours(parseInt(h), parseInt(m), 0);
      fechaTemp.setHours(fechaTemp.getHours() + horasASumar);
      const horaFin = fechaTemp.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      return `${horaInicio} - ${horaFin}`;
    } catch {
      return fechaCompleta.split(" ")[1] || "";
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto pb-20 pt-6 px-4 animate-fade-in relative">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Mis Reservas</h1>
        <p className="text-gray-400 mt-2">
          {isDJ
            ? "Gestiona tus próximos bolos y solicitudes."
            : "Seguimiento de tus eventos contratados."}
        </p>
      </div>

      {reservas.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center border-dashed border-white/10">
          <Calendar size={48} className="mx-auto mb-4 text-gray-600" />
          <h3 className="text-xl font-bold text-white mb-2">
            No tienes reservas
          </h3>
          <p className="text-gray-400">
            {isDJ
              ? "¡Pronto empezarán a llegar las solicitudes!"
              : "Explora el catálogo y contrata a tu primer DJ."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {reservas.map((reserva) => {
            const fechaReal = parseDate(reserva.fecha);

            const canReview =
              !isDJ &&
              (reserva.estado?.toLowerCase() === "aceptada" ||
                reserva.estado?.toLowerCase() === "finalizada") &&
              !ratedReservas.includes(reserva.id);

            return (
              <div
                key={reserva.id}
                className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col sm:flex-row gap-6 hover:border-primary/50 transition-colors relative overflow-hidden"
              >
                {(reserva.estado?.toLowerCase() === "aceptada" ||
                  reserva.estado?.toLowerCase() === "finalizada") && (
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
                )}

                <div className="flex-1 space-y-4 relative z-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full border ${getStatusColor(reserva.estado)} uppercase tracking-wider`}
                      >
                        {reserva.estado || "Pendiente"}
                      </span>
                      <h3 className="text-xl font-bold text-white mt-3">
                        {isDJ
                          ? `Evento de ${reserva.nombreCliente}`
                          : `Reserva con ${reserva.nombreDj}`}
                      </h3>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-white">
                        {reserva.precio}€
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-300 bg-black/20 p-2 rounded-lg">
                      <Calendar size={16} className="text-primary" />
                      {fechaReal.toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 bg-black/20 p-2 rounded-lg">
                      <Clock size={16} className="text-primary" />
                      <span>
                        {formatRangoHoras(reserva.fecha, reserva.horario)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 bg-black/20 p-2 rounded-lg col-span-2 truncate">
                      <MapPin size={16} className="text-primary shrink-0" />
                      <span className="truncate">{reserva.lugar}</span>
                    </div>
                  </div>
                </div>

                {/* ✅ BOTONES DE ACCIÓN: Sin bordes, centrados y con un ancho mínimo */}
                <div className="flex sm:flex-col justify-center gap-3 pt-4 sm:pt-0 relative z-10 shrink-0 sm:min-w-[130px]">
                  <button
                    onClick={() => navigate(`/chat/${reserva.id}`)}
                    className="w-full btn-primary bg-white/5 hover:bg-primary/20 text-white px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 border border-white/10 transition-all shadow-md"
                  >
                    <MessageSquare size={18} /> Chat
                  </button>

                  {/* 🌟 BOTÓN DE VALORAR */}
                  {canReview && (
                    <button
                      onClick={() =>
                        setReviewModal({
                          open: true,
                          reservaId: reserva.id,
                          djName: reserva.nombreDj,
                        })
                      }
                      className="w-full bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 border border-yellow-500/20 transition-all shadow-md"
                    >
                      <Star size={18} /> Valorar
                    </button>
                  )}

                  {/* Botones de Aceptar/Rechazar si eres DJ y está pendiente */}
                  {isDJ && reserva.estado?.toLowerCase() === "pendiente" && (
                    <div className="flex gap-2 w-full">
                      <button
                        onClick={() =>
                          handleUpdateStatus(reserva.id, "Aceptada")
                        }
                        className="flex-1 bg-green-500/20 hover:bg-green-500 text-green-400 hover:text-white p-2 rounded-xl transition-colors flex justify-center border border-green-500/20 shadow-md"
                        title="Aceptar Reserva"
                      >
                        <CheckCircle size={20} />
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateStatus(reserva.id, "Rechazada")
                        }
                        className="flex-1 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white p-2 rounded-xl transition-colors flex justify-center border border-red-500/20 shadow-md"
                        title="Rechazar Reserva"
                      >
                        <XCircle size={20} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL DE VALORACIÓN */}
      {reviewModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel p-8 rounded-3xl max-w-md w-full border border-white/10 relative shadow-2xl">
            <button
              onClick={() =>
                setReviewModal({ open: false, reservaId: null, djName: "" })
              }
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <XCircle size={24} />
            </button>

            <h2 className="text-2xl font-bold text-white mb-2">
              Valorar Evento
            </h2>
            <p className="text-gray-400 mb-6 text-sm">
              ¿Qué te pareció la actuación de{" "}
              <span className="text-primary font-bold">
                {reviewModal.djName}
              </span>
              ?
            </p>

            <form onSubmit={handleReviewSubmit} className="space-y-6">
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      size={40}
                      fill={
                        star <= (hoverRating || rating)
                          ? "#EAB308"
                          : "transparent"
                      }
                      className={
                        star <= (hoverRating || rating)
                          ? "text-yellow-500"
                          : "text-gray-600"
                      }
                    />
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Deja un comentario (opcional)
                </label>
                <textarea
                  className="glass-input w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 resize-none"
                  rows={4}
                  placeholder="¡La sesión fue increíble, la pista no paró de bailar!..."
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="w-full btn-primary py-3 rounded-xl font-bold flex justify-center items-center gap-2 shadow-lg"
              >
                {submittingReview ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "Enviar Valoración"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
