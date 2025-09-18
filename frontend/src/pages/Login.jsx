import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Tentative de connexion avec:', { email });
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
                email,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Réponse du serveur:', response.data);
            localStorage.setItem('token', response.data.token);
            navigate('/contacts');
        } catch (err) {
            console.error('Erreur de connexion:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            });
            setError(err.response?.data?.message || 'Erreur de connexion. Veuillez réessayer.');
        }
    };

    return (
        <div>
            <h2>Connexion</h2>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Mot de passe:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Se connecter</button>
            </form>
            <p>
                Pas de compte ? <a href="/register">S'inscrire</a>
            </p>
        </div>
    );
}