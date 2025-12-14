```javascript
import { useState } from 'react';
import { Github, ArrowRight, Loader2 } from 'lucide-react';
import axios from 'axios';

import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "../components/LoginButton";
import LogoutButton from "../components/LogoutButton";

const Home = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();
    const [repoUrl, setRepoUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!repoUrl) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            // Step 12: Integration
            const response = await axios.post('/api/analyze', { repoUrl });
            setResult(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to analyze repository. Please check the URL.');
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
    }

    return (
        <div className="home-container" style={{ width: '100%', maxWidth: '800px' }}>
            <header style={{ textAlign: 'center', marginBottom: '3rem', position: 'relative' }}>
                {isAuthenticated && (
                    <div style={{ position: 'absolute', right: 0, top: 0 }}>
                        <LogoutButton />
                    </div>
                )}
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem', background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Commitly
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
                    AI-Powered GitHub Repository Auditor
                </p>
            </header>

                            value={repoUrl}
                            onChange={(e) => setRepoUrl(e.target.value)}
                            style={{ paddingLeft: '40px' }}
                        />
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <>Analyze <ArrowRight size={20} /></>}
                    </button>
                </form>
                {error && <p style={{ color: 'var(--danger)', marginTop: '1rem' }}>{error}</p>}
            </div>

            {/* Results Section (Step 11 placeholder) */}
            {result && (
                <div className="results-container">
                    <div className="card" style={{ marginBottom: '2rem', textAlign: 'center' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{result.score} / 100</h2>
                        <p style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>{result.level}</p>
                    </div>

                    <div className="card" style={{ marginBottom: '2rem' }}>
                        <h3>Mentor Summary</h3>
            {!isAuthenticated ? (
                <div style={{ textAlign: 'center', marginTop: '5rem' }}>
                    <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Please log in to analyze your GitHub repositories.</p>
                    <LoginButton />
                </div>
            ) : (
                <>
                    <div className="form-container" style={{ marginBottom: '3rem' }}>
                        <form onSubmit={handleAnalyze} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ position: 'relative', flexGrow: 1 }}>
                                <Github style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={20} />
                                <input
                                    type="text"
                                    placeholder="Enter GitHub repository URL (e.g., https://github.com/owner/repo)"
                                    className="input-field"
                                    value={repoUrl}
                                    onChange={(e) => setRepoUrl(e.target.value)}
                                    style={{ paddingLeft: '40px' }}
                                />
                            </div>
                            <button type="submit" className="btn-primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <>Analyze <ArrowRight size={20} /></>}
                            </button>
                        </form>
                        {error && <p style={{ color: 'var(--danger)', marginTop: '1rem' }}>{error}</p>}
                    </div>

                    {/* Results Section (Step 11 placeholder) */}
                    {result && (
                        <div className="results-container">
                            <div className="card" style={{ marginBottom: '2rem', textAlign: 'center' }}>
                                <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{result.score} / 100</h2>
                                <p style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>{result.level}</p>
                            </div>

                            <div className="card" style={{ marginBottom: '2rem' }}>
                                <h3>Mentor Summary</h3>
                                <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>{result.summary}</p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <div className="card">
                                    <h3>Breakdown</h3>
                                    <ul style={{ listStyle: 'none', marginTop: '1rem' }}>
                                        {result.breakdown && result.breakdown.map((item, idx) => (
                                            <li key={idx} style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="card">
                                    <h3>Personalized Roadmap</h3>
                                    <ul style={{ listStyle: 'none', marginTop: '1rem' }}>
                                        {result.roadmap && result.roadmap.map((step, idx) => (
                                            <li key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                                <span style={{ background: 'var(--accent-primary)', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>{idx + 1}</span>
                                                <span>{step}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Home;
