import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. IMPORTANTE: Importar el hook
import { getPlansByGym, createPlan } from './services/planService';

function GestionPlanes() {
  const [planes, setPlanes] = useState([]);
  const [nuevoPlan, setNuevoPlan] = useState({ name: '', price: '', durationDays: 30 });
  const gymId = localStorage.getItem('gymId');

  // 2. IMPORTANTE: Inicializar el navigate
  const navigate = useNavigate();

  useEffect(() => {
    if (!gymId) {
      navigate('/login'); // Seguridad: si no hay gymId, afuera.
    } else {
      cargarPlanes();
    }
  }, [gymId]);

  const cargarPlanes = async () => {
    try {
      const data = await getPlansByGym(gymId);
      setPlanes(data);
    } catch (error) {
      console.error("Error al cargar planes:", error);
    }
  };

  const handleCrearPlan = async (e) => {
    e.preventDefault();
    try {
      console.log("Enviando nuevo plan...", nuevoPlan);
      await createPlan(nuevoPlan, gymId);

      // Limpiar el formulario y recargar la lista
      setNuevoPlan({ name: '', price: '', durationDays: 30 });
      cargarPlanes();
      alert("✅ Plan creado con éxito");
    } catch (error) {
      console.error("Error al crear el plan:", error);
      alert("❌ No se pudo crear el plan");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 font-sans">
      {/* BOTÓN VOLVER - Ahora con navigate('/') o '/dashboard' */}
      <button
        onClick={() => navigate('/dashboard')}
        className="text-slate-400 hover:text-blue-500 mb-6 flex items-center gap-2 transition-all font-medium"
      >
        ← Volver al Panel de Control
      </button>

      <header className="mb-10">
        <h2 className="text-3xl font-extrabold text-blue-500">Configuración de Planes</h2>
        <p className="text-slate-400">Definí los servicios y precios de tu gimnasio.</p>
      </header>

      {/* FORMULARIO DE CREACIÓN */}
      <form onSubmit={handleCrearPlan} className="bg-slate-800 p-6 rounded-2xl mb-10 grid grid-cols-1 md:grid-cols-3 gap-4 items-end border border-slate-700 shadow-xl">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-300">Nombre del Plan</label>
          <input
            value={nuevoPlan.name}
            onChange={(e) => setNuevoPlan({...nuevoPlan, name: e.target.value})}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Ej: Pase Libre" required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-300">Precio Mensual ($)</label>
          <input
            type="number"
            value={nuevoPlan.price}
            onChange={(e) => setNuevoPlan({...nuevoPlan, price: e.target.value})}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="15000" required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition-all active:scale-95"
        >
          + Guardar Nuevo Plan
        </button>
      </form>

      {/* LISTADO DE PLANES ACTIVOS */}
      <h3 className="text-xl font-bold mb-4 text-slate-300">Planes Actuales</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {planes.length === 0 ? (
          <p className="text-slate-500 italic">No tenés planes creados todavía.</p>
        ) : (
          planes.map(plan => (
            <div key={plan.id} className="bg-slate-800 p-6 rounded-2xl border-t-4 border-blue-500 shadow-xl hover:translate-y-[-5px] transition-all">
              <h4 className="text-lg font-bold text-white uppercase tracking-wider">{plan.name}</h4>
              <p className="text-3xl font-black mt-3 text-blue-400">${plan.price.toLocaleString('es-AR')}</p>
              <div className="mt-4 pt-4 border-t border-slate-700 text-slate-400 text-sm">
                Vigencia: {plan.durationDays} días
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default GestionPlanes;