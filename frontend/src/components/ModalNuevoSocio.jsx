import React, { useState, useEffect } from 'react';
import { createMember, updateMember } from '../services/memberService';
import { getPlansByGym } from '../services/planService';

const getTodayDate = () => {
  const hoy = new Date();
  const offset = hoy.getTimezoneOffset() * 60000;
  return (new Date(hoy - offset)).toISOString().split('T')[0];
};

function ModalNuevoSocio({ isOpen, onClose, onSocioGuardado, socioAEditar, gymId }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dni: '',
    email: '',
    subscriptionPlanId: '',
    registrationDate: getTodayDate()
  });
  const [planes, setPlanes] = useState([]);
  const [planInactivoDetectado, setPlanInactivoDetectado] = useState(false);

  useEffect(() => {
    if (isOpen && gymId) {
      const cargarPlanes = async () => {
        try {
          const data = await getPlansByGym(gymId);
          setPlanes(data);

          // Lógica de validación para socios editados
          if (socioAEditar) {
            const planIdActual = socioAEditar.subscriptionPlan?.id;
            // Verificamos si el plan del socio está en la lista de planes ACTIVOS
            const elPlanSigueActivo = data.some(p => p.id === planIdActual);

            if (planIdActual && !elPlanSigueActivo) {
              setPlanInactivoDetectado(true);

              setFormData(prev => ({ ...prev, subscriptionPlanId: '' }));
            } else {
              setPlanInactivoDetectado(false);
              setFormData(prev => ({ ...prev, subscriptionPlanId: planIdActual || '' }));
            }
          }
        } catch (error) {
          console.error("Error al traer planes:", error);
        }
      };
      cargarPlanes();
    }
  }, [isOpen, gymId, socioAEditar]);

  useEffect(() => {
    if (socioAEditar) {
      setFormData({
        ...socioAEditar,
        registrationDate: socioAEditar.registrationDate || getTodayDate()
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        dni: '',
        email: '',
        subscriptionPlanId: '',
        registrationDate: getTodayDate()
      });
      setPlanInactivoDetectado(false);
    }
  }, [socioAEditar, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (socioAEditar) {
        await updateMember(socioAEditar.id, formData);
      } else {
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
        <h2 className="text-2xl font-bold mb-2 text-blue-500">
          {socioAEditar ? 'Editar Socio' : 'Nuevo Socio'}
        </h2>


        {planInactivoDetectado && (
          <p className="text-amber-400 text-xs font-bold mb-4 bg-amber-400/10 p-2 rounded border border-amber-400/20">
            ⚠️ El plan anterior de este socio fue eliminado. Por favor, asigne un nuevo plan vigente.
          </p>
        )}

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

          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400 ml-1">Plan de Suscripción</label>
            <select
              className={`w-full bg-slate-900 border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 text-slate-300 ${planInactivoDetectado ? 'border-amber-500 animate-pulse' : 'border-slate-700'}`}
              value={formData.subscriptionPlanId}
              onChange={(e) => {
                setFormData({...formData, subscriptionPlanId: e.target.value});
                setPlanInactivoDetectado(false); // Se limpia el aviso al elegir uno nuevo
              }}
              required
            >
              <option value="">Seleccionar Plan Vigente...</option>
              {planes.map(plan => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} - ${plan.price.toLocaleString('es-AR')}
                </option>
              ))}
            </select>
          </div>


          <input
            type="text" placeholder="DNI"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 text-white"
            value={formData.dni}
            onChange={(e) => setFormData({...formData, dni: e.target.value})}
            required
          />

          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400 ml-1">Fecha de Ingreso</label>
            <input
              type="date"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 text-white"
              value={formData.registrationDate}
              onChange={(e) => setFormData({...formData, registrationDate: e.target.value})}
              required
            />
          </div>

          <input
            type="email" placeholder="Email"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 text-white"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />

          <div className="flex gap-3 mt-6">
            <button type="button" onClick={onClose} className="flex-1 bg-slate-700 hover:bg-slate-600 py-3 rounded-lg font-bold transition-colors">
              Cancelar
            </button>
            <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold transition-all shadow-lg shadow-blue-900/20">
              {socioAEditar ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalNuevoSocio;