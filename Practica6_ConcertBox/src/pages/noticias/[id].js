import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import { mockNews } from '../../utils/mockData';

export default function ArticuloCompleto() {
    const router = useRouter();
    const { id } = router.query;
    
    // Si no está listo el router, mostramos un loading
    if (!router.isReady) return <div className="dark-theme-container"><Navbar /><p style={{padding: '2rem', textAlign: 'center'}}>Cargando...</p></div>;

    const article = mockNews.find(n => n.id === id);

    if (!article) {
        return (
            <div className="dark-theme-container">
                <Navbar />
                <main style={{ padding: '2rem', textAlign: 'center' }}>
                    <h1>Artículo no encontrado</h1>
                    <Link href="/noticias" style={{ color: '#e91e63', marginTop: '1rem', display: 'inline-block' }}>Volver a noticias</Link>
                </main>
            </div>
        );
    }

    return (
        <div className="dark-theme-container">
            <Navbar />
            <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                <Link href="/noticias" style={{ color: 'var(--text-dim)', textDecoration: 'none', marginBottom: '2rem', display: 'inline-block' }}>
                    ← Volver a Noticias
                </Link>
                
                <article>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{article.title}</h1>
                    <p style={{ color: '#e91e63', fontWeight: 'bold', marginBottom: '2rem' }}>Publicado el {article.date}</p>
                    
                    <div style={{ position: 'relative', width: '100%', height: '400px', borderRadius: '12px', overflow: 'hidden', marginBottom: '2rem' }}>
                        <Image src={article.imageUrl} alt={article.title} layout="fill" objectFit="cover" />
                    </div>
                    
                    <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#ddd' }}>
                        {article.content.split('\n').map((paragraph, index) => (
                            <p key={index} style={{ marginBottom: '1.5rem' }}>{paragraph}</p>
                        ))}
                    </div>
                </article>
            </main>
        </div>
    );
}
