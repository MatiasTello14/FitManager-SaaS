import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMembersByGym, toggleMemberStatus } from './services/memberService';
import ModalNuevoSocio from './ModalNuevoSocio';

function Dashboard() {
  const [socios, setSocios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [socioSeleccionado, setSocioSeleccionado] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const GYM_ID = 1;

  const cargarSocios = async () => {
      try {
        const data = await getMembersByGym(GYM_ID); // Usamos la variable
        setSocios(data);
      } catch (error) {
        console.error("Error al cargar socios:", error);
      }
    };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    } else {
      cargarSocios();
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const sociosFiltrados = socios.filter((socio) => {
    const nombreCompleto = `${socio.firstName} ${socio.lastName}`.toLowerCase();
    const dni = socio.dni ? socio.dni.toString() : "";
    const termino = busqueda.toLowerCase();
    return nombreCompleto.includes(termino) || dni.includes(termino);
  });

  const handleToggleStatus = async (id) => {
    try {
      await toggleMemberStatus(id);
      cargarSocios();
    } catch (error) {
      alert("No se pudo cambiar el estado");
    }
  };

  const proximosVencimientos = socios.filter(socio => {
    if (!socio.active) return false;
    const fechaIngreso = new Date(socio.registrationDate);
    const hoy = new Date();
    const diaIngreso = fechaIngreso.getDate();
    const diaHoy = hoy.getDate();
    return diaIngreso >= diaHoy && diaIngreso <= diaHoy + 7;
  }).length;

  const abrirEditarSocio = (socio) => {
    setSocioSeleccionado(socio);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      {/* BARRA DE NAVEGACIÓN */}
      <nav className="flex justify-between items-center bg-slate-800 p-6 shadow-2xl border-b border-slate-700">
        <h1 className="text-2xl font-bold tracking-tighter text-blue-500">
          🏋️‍♂️ FIT<span className="text-white">MANAGER</span>
        </h1>
        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 transition-colors px-4 py-2 rounded-lg font-medium shadow-lg active:scale-95">
          Cerrar Sesión
        </button>
      </nav>

      <main className="p-8 max-w-6xl mx-auto">
        <header className="mb-10">
          <h2 className="text-4xl font-extrabold mb-2 text-white">Panel de Control</h2>
          <p className="text-slate-400">Gestioná tu gimnasio de forma inteligente.</p>
        </header>

        {/* TARJETAS DE ESTADÍSTICAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Tarjeta 1: Membresías */}
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
            <h3 className="text-slate-400 font-medium mb-1 text-sm">Estado de Membresías</h3>
            <p className="text-4xl font-bold text-white">
              {socios.length} <span className="text-sm font-normal text-slate-500">en total</span>
            </p>
            <div className="mt-4 text-sm font-bold text-green-400">
              🟢 {socios.filter(s => s.active).length} Activos
            </div>
            <div className="mt-1 text-sm font-bold text-red-400">
              🔴 {socios.filter(s => !s.active).length} De baja
            </div>
          </div>

          {/* Tarjeta 2: Vencimientos */}
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
            <h3 className="text-slate-400 font-medium mb-1 text-sm">Próximos Vencimientos</h3>
            <p className="text-4xl font-bold text-orange-400">{proximosVencimientos}</p>
            <div className="mt-4 text-sm text-slate-500">
              Socios a vencer en los próximos 7 días
            </div>
          </div>

          {/* Tarjeta 3: Ingresos */}
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
            <h3 className="text-slate-400 font-medium mb-1 text-sm">Ingresos Mensuales</h3>
            <p className="text-4xl font-bold text-white">
              ${socios
                .filter(s => s.active && s.subscriptionPlan)
                .reduce((total, s) => total + s.subscriptionPlan.price, 0)
                .toLocaleString('es-AR')}
            </p>
            <div className="mt-4 text-sm text-blue-400">
              Basado en planes activos
            </div>
          </div>
        </div>

        {/* TABLA DE SOCIOS */}
        <section className="bg-slate-800 rounded-2xl border border-slate-700 shadow-xl overflow-hidden mt-8">
          <div className="p-6 border-b border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <h3 className="text-xl font-bold">Lista de Socios</h3>
              <input
                type="text"
                placeholder="🔍 Buscar por nombre o DNI..."
                className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64 transition-all"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <button
              onClick={() => { setSocioSeleccionado(null); setIsModalOpen(true); }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-lg w-full md:w-auto"
            >
              + Nuevo Socio
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 text-slate-400 text-sm uppercase">
                  <th className="px-6 py-4 font-medium">Nombre</th>
                  <th className="px-6 py-4 font-medium">DNI</th>
                  <th className="px-6 py-4 font-medium">Ingreso</th>
                  <th className="px-6 py-4 font-medium">Estado</th>
                  <th className="px-6 py-4 font-medium text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {sociosFiltrados.map((socio) => (
                  <tr key={socio.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4 font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                          {socio.firstName[0]}{socio.lastName[0]}
                        </div>
                        <span>{socio.firstName} {socio.lastName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{socio.dni}</td>
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      {new Date(socio.registrationDate).toLocaleDateString('es-AR', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${socio.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {socio.active ? 'ACTIVO' : 'INACTIVO'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button onClick={() => abrirEditarSocio(socio)} className="text-blue-500 hover:text-blue-400 font-bold text-xs bg-blue-500/10 px-3 py-1 rounded-lg">
                          Editar
                        </button>
                        <button onClick={() => handleToggleStatus(socio.id)} className={`text-xs font-bold px-3 py-1 rounded-lg ${socio.active ? 'text-red-500 bg-red-500/10' : 'text-green-500 bg-green-500/10'}`}>
                          {socio.active ? 'Baja' : 'Alta'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

        <ModalNuevoSocio
              isOpen={isModalOpen}
              gymId={GYM_ID} // <--- SE LO PASAMOS POR PROP
              onSocioGuardado={cargarSocios}
              socioAEditar={socioSeleccionado}
              onClose={() => {
                setIsModalOpen(false);
                setSocioSeleccionado(null);
        }}
      />
    </div>
  );
}

export default Dashboard;