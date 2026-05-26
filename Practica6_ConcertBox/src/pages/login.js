import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function Login() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulamos un login exitoso guardando un valor en localStorage
        // En una app real, aquí llamaríamos al backend de Node.js
        if (typeof window !== 'undefined') {
            localStorage.setItem('isAuthenticated', 'true');
            router.push('/perfil');
        }
    };

    return (
        <div className="dark-theme-container">
            <Navbar />
            <main style={{ padding: '4rem 2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ background: 'var(--bg-card)', padding: '3rem', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                    <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</h1>
                    
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {!isLogin && (
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label>Nombre de usuario</label>
                                <input type="text" placeholder="Ej. musiclover99" required style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #444', background: '#222', color: '#fff' }} />
                            </div>
                        )}
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label>Correo Electrónico</label>
                            <input type="email" placeholder="tu@correo.com" required style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #444', background: '#222', color: '#fff' }} />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label>Contraseña</label>
                            <input type="password" placeholder="••••••••" required style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #444', background: '#222', color: '#fff' }} />
                        </div>
                        
                        <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
                            {isLogin ? 'Entrar' : 'Registrarme'}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        <button 
                            onClick={() => setIsLogin(!isLogin)} 
                            style={{ background: 'none', border: 'none', color: '#e91e63', cursor: 'pointer', textDecoration: 'underline' }}
                        >
                            {isLogin ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión'}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
