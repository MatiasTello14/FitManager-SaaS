import React, { useState, useEffect } from 'react';
import { registerPayment } from '../services/paymentService';
import { getPlansByGym } from '../services/planService';

function ModalPago({ isOpen, onClose, socio, gymId, onPagoRegistrado }) {
  const [metodo, setMetodo] = useState('Efectivo');
  const [cargando, setCargando] = useState(false);
  const [fechaPago, setFechaPago] = useState(new Date().toISOString().split('T')[0]);
  const [planInactivo, setPlanInactivo] = useState(false);

  // Verificación de integridad del plan al abrir el modal
  useEffect(() => {
    if (isOpen && gymId && socio) {
      const verificarPlan = async () => {
        try {
          const planesActivos = await getPlansByGym(gymId);
          // Verificamos si el ID del plan del socio está en la lista de planes activos
          const esActivo = planesActivos.some(p => p.id === socio.subscriptionPlanId);

          if (!esActivo && socio.subscriptionPlanId) {
            setPlanInactivo(true);
          } else {
            setPlanInactivo(false);
          }
        } catch (error) {
          console.error("Error al verificar vigencia del plan:", error);
        }
      };
      verificarPlan();
    }
  }, [isOpen, gymId, socio]);

  if (!isOpen || !socio) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (planInactivo) {
      alert("No se puede registrar el pago: El plan del socio ha sido eliminado. Por favor, actualice el plan del socio en 'Editar'.");
      return;
    }

    setCargando(true);
    try {
      // Enviamos el cobro con los datos actuales
      await registerPayment(socio.id, metodo, fechaPago);
      alert(`¡Pago registrado con éxito para ${socio.firstName}!`);
      onPagoRegistrado();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Error al registrar el pago");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 border border-slate-700 p-8 rounded-2xl shadow-2xl w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-green-500 text-center uppercase tracking-wider">
          Registrar Pago
        </h2>

        {/* ALERTA DE PLAN ELIMINADO */}
        {planInactivo && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-xl">
            <p className="text-red-400 text-xs font-bold text-center">
              ⚠️ PLAN NO VIGENTE <br/>
              Este plan fue eliminado del sistema. Debe asignar uno nuevo para cobrar.
            </p>
          </div>
        )}

        {/* INFO DEL SOCIO */}
        <div className={`p-4 rounded-xl mb-6 border shadow-inner transition-colors ${planInactivo ? 'bg-red-900/20 border-red-900/50' : 'bg-slate-900/50 border-slate-700/50'}`}>
          <p className="text-xs text-slate-500 uppercase font-bold mb-1">Socio</p>
          <p className="text-lg text-white font-medium mb-3">
            {socio.firstName} {socio.lastName}
          </p>

          <div className="flex justify-between items-end border-t border-slate-700/50 pt-3">
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold">Plan</p>
              <p className={`text-sm font-bold ${planInactivo ? 'text-red-400 line-through' : 'text-blue-400'}`}>
                {socio.planName || 'Sin Plan'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 uppercase font-bold">Monto</p>
              <p className={`text-2xl font-black ${planInactivo ? 'text-slate-500' : 'text-white'}`}>
                ${socio.planPrice ? socio.planPrice.toLocaleString('es-AR') : '0'}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">
              Fecha de Pago
            </label>
            <input
              type="date"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white outline-none focus:ring-2 focus:ring-green-500 transition-all"
              value={fechaPago}
              onChange={(e) => setFechaPago(e.target.value)}
              disabled={planInactivo}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">
              Método de Pago
            </label>
            <select
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white outline-none focus:ring-2 focus:ring-green-500 transition-all cursor-pointer"
              value={metodo}
              onChange={(e) => setMetodo(e.target.value)}
              disabled={planInactivo}
            >
              <option value="Efectivo">💵 Efectivo</option>
              <option value="Transferencia">🏦 Transferencia</option>
              <option value="Tarjeta">💳 Tarjeta</option>
            </select>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl font-bold transition-all active:scale-95"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={cargando || planInactivo}
              className={`flex-1 text-white py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95 ${
                planInactivo
                ? 'bg-slate-600 cursor-not-allowed opacity-50'
                : 'bg-green-600 hover:bg-green-500 shadow-green-900/40'
              }`}
            >
              {cargando ? 'Procesando...' : 'Confirmar Pago'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalPago;