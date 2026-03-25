import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from './services/authService';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

const manejarLogin = async (e) => {
    e.preventDefault();
    setMensaje("Cargando...");
    try {
      const response = await login(email, password);
      console.log("Respuesta del servidor:", response); // <-- AGREGÁ ESTO PARA VER QUÉ LLEGA
      navigate('/dashboard'); // <-- ESTO ES LO QUE TE MUEVE DE PÁGINA
    } catch (error) {
      console.error("Error en login:", error);
      setMensaje("❌ Credenciales incorrectas");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans text-white">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-md">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tighter text-blue-500 mb-2">
            🏋️‍♂️ FIT<span className="text-white">MANAGER</span>
          </h1>
          <p className="text-slate-400">Ingresá al panel de administración</p>
        </header>

        <form onSubmit={manejarLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Correo Electrónico</label>
            <input
              type="email"
              placeholder="ejemplo@test.com"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg transform active:scale-95 transition-all"
          >
            Ingresar
          </button>
        </form>

        {mensaje && (
          <p className={`mt-4 text-center text-sm font-medium ${mensaje.includes('❌') ? 'text-red-400' : 'text-blue-400'}`}>
            {mensaje}
          </p>
        )}
        <p className="mt-6 text-center text-slate-400">
          ¿No tenés cuenta? <Link to="/register" className="text-blue-500 hover:underline">Registrate acá</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;