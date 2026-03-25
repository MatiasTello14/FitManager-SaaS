import React, { useState, useEffect } from 'react';
import { createMember, updateMember } from './services/memberService';
import { getPlansByGym } from './services/planService';

function ModalNuevoSocio({ isOpen, onClose, onSocioGuardado, socioAEditar, gymId }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dni: '',
    email: '',
    subscriptionPlanId: ''
  });
  const [planes, setPlanes] = useState([]);

  // 1. Cargar planes usando la prop gymId
  useEffect(() => {
    if (isOpen && gymId) {
      const cargarPlanes = async () => {
        try {
          const data = await getPlansByGym(gymId);
          setPlanes(data);
        } catch (error) {
          console.error("Error al traer planes:", error);
        }
      };
      cargarPlanes();
    }
  }, [isOpen, gymId]);

  // 2. Cargar datos si es edición o resetear si es nuevo
  useEffect(() => {
    if (socioAEditar) {
      setFormData({
        ...socioAEditar,
        // Si el socio ya tiene un plan, extraemos el ID para el select
        subscriptionPlanId: socioAEditar.subscriptionPlan?.id || ''
      });
    } else {
      setFormData({ firstName: '', lastName: '', dni: '', email: '', subscriptionPlanId: '' });
    }
  }, [socioAEditar, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (socioAEditar) {
        // Para editar, enviamos los datos actualizados
        await updateMember(socioAEditar.id, formData);
      } else {
        // Para crear, usamos el gymId que recibimos del Dashboard
        await createMember(formData, gymId, formData.subscriptionPlanId);
      }
      onSocioGuardado();
      onClose();
    } catch (error) {
      alert("Error al guardar los datos del socio");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 border border-slate-700 p-8 rounded-2xl shadow-2xl w-full max-w-md transition-all">
        <h2 className="text-2xl font-bold mb-6 text-blue-500">
          {socioAEditar ? 'Editar Socio' : 'Nuevo Socio'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text" placeholder="Nombre"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 text-white"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              required
            />
            <input
              type="text" placeholder="Apellido"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 text-white"
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              required
            />
          </div>

          <select
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 text-slate-300"
            value={formData.subscriptionPlanId}
            onChange={(e) => setFormData({...formData, subscriptionPlanId: e.target.value})}
            required
          >
            <option value="">Seleccionar Plan...</option>
            {planes.map(plan => (
              <option key={plan.id} value={plan.id}>
                {plan.name} - ${plan.price.toLocaleString('es-AR')}
              </option>
            ))}
          </select>

          <input
            type="text" placeholder="DNI"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 text-white"
            value={formData.dni}
            onChange={(e) => setFormData({...formData, dni: e.target.value})}
            required
          />
          <input
            type="email" placeholder="Email"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 text-white"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-700 hover:bg-slate-600 py-3 rounded-lg font-bold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold transition-all shadow-lg shadow-blue-900/20"
            >
              {socioAEditar ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalNuevoSocio;