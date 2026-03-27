import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMembersByGym, toggleMemberStatus } from '../services/memberService';
import ModalNuevoSocio from '../components/ModalNuevoSocio';
import ModalPago from '../components/ModalPago';
import ModalHistorial from '../components/ModalHistorial';

function Dashboard() {
  const [socios, setSocios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [socioSeleccionado, setSocioSeleccionado] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPagoModalOpen, setIsPagoModalOpen] = useState(false);
  const [mostrarSoloVencidos, setMostrarSoloVencidos] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [isHistorialOpen, setIsHistorialOpen] = useState(false);
  const [planFiltrado, setPlanFiltrado] = useState('TODOS');

  const [totalIngresos, setTotalIngresos] = useState(0);
  const [sociosVencidosCount, setSociosVencidosCount] = useState(0);

  const navigate = useNavigate();

  // Función de carga movida para que use los IDs frescos
  const cargarSocios = async (idGimnasio) => {
    try {
      setCargando(true);
      const data = await getMembersByGym(idGimnasio);
      setSocios(data);
    } catch (error) {
      console.error("Error al cargar socios:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const gymId = localStorage.getItem('gymId');

    if (!token || !gymId) {
      navigate('/login');
    } else {
      cargarSocios(gymId);
    }
  }, [navigate]);

  const obtenerEstadoCuota = (lastPaymentDate) => {
    if (!lastPaymentDate) return "DEUDA_NUNCA";
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaPago = new Date(lastPaymentDate + 'T00:00:00');
    const vencimiento = new Date(fechaPago);
    vencimiento.setDate(fechaPago.getDate() + 30);
    return hoy > vencimiento ? "DEUDA_VENCIDO" : "AL_DIA";
  };

useEffect(() => {
  // 1. Calcular Ingresos (añadimos validación de seguridad)
  const ingresos = socios.reduce((total, s) => {
    // Verificamos que s.active exista y que tenga un precio válido
    const precio = s.planPrice ? Number(s.planPrice) : 0;
    if (s.active && precio > 0) {
      return total + precio;
    }
    return total;
  }, 0);
  setTotalIngresos(ingresos);

  // 2. Calcular Deudores
  const deudores = socios.filter(socio => {
    if (!socio.active) return false;
    const estado = obtenerEstadoCuota(socio.lastPaymentDate);
    return estado === "DEUDA_NUNCA" || estado === "DEUDA_VENCIDO";
  });
  setSociosVencidosCount(deudores.length);

}, [socios]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const abrirEditarSocio = (socio) => {
    setSocioSeleccionado(socio);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleMemberStatus(id);
      const gid = localStorage.getItem('gymId');
      cargarSocios(gid);
    } catch (error) {
      alert("No se pudo cambiar el estado");
    }
  };

  const renderEstadoBadge = (lastPaymentDate) => {
    const estado = obtenerEstadoCuota(lastPaymentDate);
    if (estado === "DEUDA_NUNCA") return <span className="px-2 py-1 rounded-md text-[10px] font-bold border text-red-500 bg-red-500/10 border-red-500/20 uppercase">Nunca Pagó</span>;
    if (estado === "DEUDA_VENCIDO") return <span className="px-2 py-1 rounded-md text-[10px] font-bold border text-orange-500 bg-orange-500/10 border-orange-500/20 uppercase">Vencido</span>;
    return <span className="px-2 py-1 rounded-md text-[10px] font-bold border text-green-500 bg-green-500/10 border-green-500/20 uppercase">Al Día</span>;
  };

        const sociosFiltrados = socios.filter((socio) => {
          const nombreCompleto = `${socio.firstName} ${socio.lastName}`.toLowerCase();
          const dni = socio.dni ? socio.dni.toString() : "";
          const termino = busqueda.toLowerCase();

          // 1. Coincidencia por texto (Nombre o DNI)
          const coincideBusqueda = nombreCompleto.includes(termino) || dni.includes(termino);

          // 2. Coincidencia por Plan
          const coincidePlan = planFiltrado === 'TODOS' || socio.planName === planFiltrado;

          // 3. Lógica de Deudores (si el switch está activo)
          if (mostrarSoloVencidos) {
            const estado = obtenerEstadoCuota(socio.lastPaymentDate);
            const esDeudor = estado === "DEUDA_NUNCA" || estado === "DEUDA_VENCIDO";
            return coincideBusqueda && coincidePlan && socio.active && esDeudor;
          }

          return coincideBusqueda && coincidePlan;
        });

  // Si está cargando, mostramos una pantalla limpia
  if (cargando) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      <nav className="flex justify-between items-center bg-slate-800 p-6 shadow-2xl border-b border-slate-700">
        <h1 className="text-2xl font-bold tracking-tighter text-blue-500">🏋️‍♂️ FIT<span className="text-white">MANAGER</span></h1>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/planes')} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium text-sm">⚙️ Configurar Planes</button>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-medium shadow-lg active:scale-95">Cerrar Sesión</button>
        </div>
      </nav>

      <main className="p-8 max-w-6xl mx-auto">
        <header className="mb-10">
          <h2 className="text-4xl font-extrabold mb-2 text-white">Panel de Control</h2>
          <p className="text-slate-400">Gestioná tu gimnasio de forma inteligente.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
            <h3 className="text-slate-400 font-medium mb-1 text-sm uppercase">Socios Totales</h3>
            <p className="text-4xl font-bold text-white">{socios.length}</p>
            <div className="mt-4 text-sm font-bold text-green-400">🟢 {socios.filter(s => s.active).length} Activos</div>
          </div>
          <div onClick={() => setMostrarSoloVencidos(!mostrarSoloVencidos)} className={`p-6 rounded-2xl border shadow-lg cursor-pointer transition-all duration-300 group ${mostrarSoloVencidos ? 'bg-red-900/30 border-red-500 scale-[1.02]' : 'bg-slate-800 border-slate-700 hover:border-red-500/50'}`}>
            <h3 className="text-slate-400 font-medium text-sm uppercase group-hover:text-red-400">Socios con Deuda</h3>
            <p className="text-4xl font-bold text-red-500">{sociosVencidosCount}</p>
            <div className="mt-4 text-xs text-slate-500 italic">Click para {mostrarSoloVencidos ? 'ver todos' : 'filtrar deudores'}</div>
          </div>
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
            <h3 className="text-slate-400 font-medium mb-1 text-sm uppercase">Ingresos Mensuales</h3>
            <p className="text-4xl font-bold text-white">${totalIngresos.toLocaleString('es-AR')}</p>
            <div className="mt-4 text-sm text-blue-400">Estimado en base a activos</div>
          </div>
        </div>

        <section className="bg-slate-800 rounded-2xl border border-slate-700 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4">
            <h3 className="text-xl font-bold">Lista de Socios</h3>
            <div className="flex gap-4 w-full md:w-auto">
                <select
                    value={planFiltrado}
                    onChange={(e) => setPlanFiltrado(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500 text-slate-300"
                  >
                    <option value="TODOS">Todos los Planes</option>

                    {[...new Set(socios.map(s => s.planName).filter(Boolean))].map(nombrePlan => (
                      <option key={nombrePlan} value={nombrePlan}>{nombrePlan}</option>
                    ))}
                  </select>
              <input type="text" placeholder="🔍 Buscar..." className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
              <button onClick={() => { setSocioSeleccionado(null); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap">+ Nuevo Socio</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-900/50 text-slate-400 text-sm uppercase font-black">
                  <th className="px-6 py-4">Socio / Plan</th>
                  <th className="px-6 py-4 text-center">Estado Cuota</th>
                  <th className="px-6 py-4 text-center">Último Pago</th>
                  <th className="px-6 py-4">DNI</th>
                  <th className="px-6 py-4 text-center">Gestión</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {sociosFiltrados.map((socio) => (
                  <tr key={socio.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4 cursor-pointer group" onClick={() => { setSocioSeleccionado(socio); setIsHistorialOpen(true); }}>
                      <div className="flex flex-col">
                         <span className="font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
                           {socio.firstName} {socio.lastName} 🔍
                         </span>
                         <span className="text-[10px] text-blue-400 uppercase font-black tracking-tighter">{socio.planName || 'Sin Plan'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">{renderEstadoBadge(socio.lastPaymentDate)}</td>
                    <td className="px-6 py-4 text-center text-slate-400 text-sm">{socio.lastPaymentDate ? new Date(socio.lastPaymentDate + 'T00:00:00').toLocaleDateString('es-AR') : '---'}</td>
                    <td className="px-6 py-4 text-slate-300 font-mono text-sm">{socio.dni}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => abrirEditarSocio(socio)} className="text-blue-500 font-bold text-[10px] bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20 hover:bg-blue-500/20 uppercase">Editar</button>
                        <button onClick={() => { setSocioSeleccionado(socio); setIsPagoModalOpen(true); }} className="text-green-500 font-bold text-[10px] bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/20 hover:bg-green-500/20 uppercase">Cobrar</button>
                        <button onClick={() => handleToggleStatus(socio.id)} className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border uppercase ${socio.active ? 'text-red-500 bg-red-500/10 border-red-500/20 hover:bg-red-500/20' : 'text-green-500 bg-green-500/10 border-green-500/20 hover:bg-green-500/20'}`}>{socio.active ? 'Baja' : 'Alta'}</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <ModalNuevoSocio isOpen={isModalOpen} gymId={localStorage.getItem('gymId')} onSocioGuardado={() => cargarSocios(localStorage.getItem('gymId'))} socioAEditar={socioSeleccionado} onClose={() => { setIsModalOpen(false); setSocioSeleccionado(null); }} />
      <ModalPago isOpen={isPagoModalOpen} socio={socioSeleccionado} onClose={() => { setIsPagoModalOpen(false); setSocioSeleccionado(null); }} onPagoRegistrado={() => cargarSocios(localStorage.getItem('gymId'))} />
          <ModalHistorial isOpen={isHistorialOpen} socio={socioSeleccionado} onClose={() => setIsHistorialOpen(false)}/>
    </div>
  );
}

export default Dashboard;