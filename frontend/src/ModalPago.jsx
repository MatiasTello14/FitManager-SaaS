import React, { useState } from 'react';
import { registerPayment } from './services/paymentService';

function ModalPago({ isOpen, onClose, socio, onPagoRegistrado }) {
  const [metodo, setMetodo] = useState('Efectivo');
  const [cargando, setCargando] = useState(false);
  const [fechaPago, setFechaPago] = useState(new Date().toISOString().split('T')[0]);

  if (!isOpen || !socio) return null;

const handleSubmit = async (e) => {
  e.preventDefault();
  setCargando(true);
  try {
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

        {/* CONTENEDOR DE INFO DEL SOCIO Y PLAN */}
        <div className="bg-slate-900/50 p-4 rounded-xl mb-6 border border-slate-700/50 shadow-inner">
          <p className="text-xs text-slate-500 uppercase font-bold mb-1">Socio</p>
          <p className="text-lg text-white font-medium mb-3">
            {socio.firstName} {socio.lastName}
          </p>

          <div className="flex justify-between items-end border-t border-slate-700/50 pt-3">
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold">Plan</p>
              {/* ✅ CORRECCIÓN: Usar planName del DTO */}
              <p className="text-sm text-blue-400 font-bold">{socio.planName || 'Sin Plan'}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 uppercase font-bold">Total a Cobrar</p>
              {/* ✅ CORRECCIÓN: Usar planPrice del DTO */}
              <p className="text-2xl font-black text-white">
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
              disabled={cargando}
              className="flex-1 bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-green-900/40 disabled:opacity-50 active:scale-95"
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