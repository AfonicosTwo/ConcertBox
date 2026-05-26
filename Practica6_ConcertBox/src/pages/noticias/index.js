import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../../components/Navbar';
import { mockNews } from '../../utils/mockData';

export default function Noticias() {
    return (
        <div className="dark-theme-container">
            <Navbar />
            <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                <h1 style={{ marginBottom: '2rem', borderBottom: '1px solid #333', paddingBottom: '1rem' }}>Últimas Noticias</h1>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {mockNews.map(news => (
                        <article key={news.id} style={{ display: 'flex', gap: '1.5rem', background: 'var(--bg-card)', padding: '1rem', borderRadius: '8px' }}>
                            <div style={{ position: 'relative', width: '200px', height: '150px', flexShrink: 0, borderRadius: '6px', overflow: 'hidden' }}>
                                <Image src={news.imageUrl} alt={news.title} layout="fill" objectFit="cover" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{news.date}</p>
                                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                                    <Link href={`/noticias/${news.id}`} style={{ textDecoration: 'none', color: '#fff' }}>
                                        {news.title}
                                    </Link>
                                </h2>
                                <p style={{ color: '#ccc', marginBottom: '1rem' }}>{news.excerpt}</p>
                                <Link href={`/noticias/${news.id}`} style={{ color: '#e91e63', fontWeight: 'bold', textDecoration: 'none' }}>
                                    Leer artículo completo →
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </main>
        </div>
    );
}
