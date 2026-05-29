import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function Login() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
        const payload = isLogin 
            ? { email, password } 
            : { username, email, password };

        try {
            const response = await fetch(`${BACKEND_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Algo salió mal. Inténtalo de nuevo.');
            }

            // Guardar datos de sesión en localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('token', data.token);
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('user', JSON.stringify({
                    _id: data._id,
                    username: data.username,
                    email: data.email
                }));
                router.push('/perfil');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="dark-theme-container">
            <Navbar />
            <main style={{ padding: '4rem 2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ background: 'var(--bg-card)', padding: '3rem', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                    <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</h1>
                    
                    {error && (
                        <div style={{ background: '#d32f2f', color: '#fff', padding: '0.8rem', borderRadius: '6px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {!isLogin && (
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label>Nombre de usuario</label>
                                <input 
                                    type="text" 
                                    placeholder="Ej. musiclover99" 
                                    required 
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #444', background: '#222', color: '#fff' }} 
                                />
                            </div>
                        )}
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label>Correo Electrónico</label>
                            <input 
                                type="email" 
                                placeholder="tu@correo.com" 
                                required 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #444', background: '#222', color: '#fff' }} 
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label>Contraseña</label>
                            <input 
                                type="password" 
                                placeholder="••••••••" 
                                required 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #444', background: '#222', color: '#fff' }} 
                            />
                        </div>
                        
                        <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }} disabled={isLoading}>
                            {isLoading ? 'Cargando...' : (isLogin ? 'Entrar' : 'Registrarme')}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        <button 
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                            }} 
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
