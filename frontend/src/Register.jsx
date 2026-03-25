import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from './services/authService';

function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const manejarRegistro = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      setMensaje("✅ ¡Registrado! Redirigiendo al login...");
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      setMensaje("❌ Error al registrar usuario");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 text-white">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-500 mb-6">Crear Cuenta</h2>
        <form onSubmit={manejarRegistro} className="space-y-4">
          <input
            type="text" placeholder="Nombre de usuario"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setFormData({...formData, username: e.target.value})} required
          />
          <input
            type="email" placeholder="Correo electrónico"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setFormData({...formData, email: e.target.value})} required
          />
          <input
            type="password" placeholder="Contraseña"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setFormData({...formData, password: e.target.value})} required
          />
          <button className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold transition-all">Registrarse</button>
        </form>
        <p className="mt-6 text-center text-slate-400">
          ¿Ya tenés cuenta? <Link to="/" className="text-blue-500 hover:underline">Iniciá sesión</Link>
        </p>
        {mensaje && <p className="mt-4 text-center text-sm text-blue-400">{mensaje}</p>}
      </div>
    </div>
  );
}

export default Register;