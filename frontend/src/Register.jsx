import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerGym } from './services/authService';

function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    gymName: '',
    gymAddress: ''
  });
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const manejarRegistro = async (e) => {
    e.preventDefault();
    setMensaje("Registrando gimnasio...");
    try {
      // ✅ Enviamos el formData completo porque los nombres coinciden con el DTO del Backend
      // (firstName, lastName, email, password, gymName, gymAddress)
      await registerGym(formData);

      setMensaje("✅ ¡Gimnasio registrado con éxito! Redirigiendo al login...");
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      console.error("Error en registro:", error);

      // 💡 Tip: Si el backend devuelve un objeto de errores de @Valid,
      // acá podrías mapearlo. Por ahora mostramos el mensaje general.
      const errorMsg = typeof error === 'string' ? error : (error.message || "Datos inválidos");
      setMensaje(`❌ Error: ${errorMsg}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white font-sans">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-2xl">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-blue-500 italic">FITMANAGER <span className="text-white">SAAS</span></h1>
          <p className="text-slate-400">Creá tu cuenta de administrador y registrá tu gimnasio</p>
        </header>

        <form onSubmit={manejarRegistro} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-blue-400 border-b border-slate-700 pb-2">Tus Datos</h2>
            <input name="firstName" placeholder="Nombre" onChange={handleChange} required className="input-style" value={formData.firstName} />
            <input name="lastName" placeholder="Apellido" onChange={handleChange} required className="input-style" value={formData.lastName} />
            <input name="email" type="email" placeholder="Email profesional" onChange={handleChange} required className="input-style" value={formData.email} />
            <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} required className="input-style" value={formData.password} />
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-blue-400 border-b border-slate-700 pb-2">Tu Gimnasio</h2>
            <input name="gymName" placeholder="Nombre del Gimnasio" onChange={handleChange} required className="input-style" value={formData.gymName} />
            <input name="gymAddress" placeholder="Dirección" onChange={handleChange} required className="input-style" value={formData.gymAddress} />
            <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700 text-xs text-slate-400">
              <p>ℹ️ Al registrarte, serás el administrador principal de este gimnasio.</p>
            </div>
          </div>

          <button type="submit" className="md:col-span-2 w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold text-lg shadow-lg transition-all active:scale-95">
            Registrar Gimnasio y Cuenta
          </button>
        </form>

        {mensaje && (
          <p className={`mt-6 text-center font-medium ${mensaje.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>
            {mensaje}
          </p>
        )}

        <p className="mt-6 text-center text-slate-400">
          ¿Ya tenés un gimnasio? <Link to="/login" className="text-blue-400 hover:underline">Iniciá sesión</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;