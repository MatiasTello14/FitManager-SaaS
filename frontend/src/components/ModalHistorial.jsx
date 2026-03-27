import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ModalHistorial({ isOpen, onClose, socio }) {
  const [pagos, setPagos] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (isOpen && socio) {
      obtenerHistorial();
    }
  }, [isOpen, socio]);

  const obtenerHistorial = async () => {
    setCargando(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8080/api/payments/member/${socio.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPagos(response.data);
    } catch (error) {
      console.error("Error al obtener historial", error);
    } finally {
      setCargando(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
          <div>
            <h3 className="text-xl font-bold text-white">Historial de Pagos</h3>
            <p className="text-blue-400 text-sm font-medium">{socio?.firstName} {socio?.lastName}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors text-2xl">&times;</button>
        </div>

        <div className="p-6 max-h-[400px] overflow-y-auto custom-scrollbar">
          {cargando ? (
            <p className="text-center text-slate-400 animate-pulse">Cargando pagos...</p>
          ) : pagos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-500 italic">No hay pagos registrados aún.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pagos.map((pago) => (
                <div key={pago.id} className="bg-slate-900/50 border border-slate-700 p-4 rounded-xl flex justify-between items-center group hover:border-blue-500/50 transition-all">
                  <div>
                    <p className="text-slate-100 font-bold text-sm">
                      {new Date(pago.paymentDate).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{pago.paymentMethod}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-black text-lg">${pago.amount.toLocaleString('es-AR')}</p>
                    <p className="text-[9px] text-blue-400 uppercase font-bold">{pago.planName}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-900/30 text-center">
          <button onClick={onClose} className="text-slate-400 hover:text-white text-sm font-bold uppercase tracking-tighter">Cerrar</button>
        </div>
      </div>
    </div>
  );
}

export default ModalHistorial;