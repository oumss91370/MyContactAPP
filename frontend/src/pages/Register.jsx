import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        try {
            // 1. Inscription
            await axios.post('http://localhost:3000/api/auth/register', {
                email: formData.email,
                password: formData.password
            });

            // 2. Connexion automatique
            const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
                email: formData.email,
                password: formData.password
            });

            // 3. Sauvegarde du token
            localStorage.setItem('token', loginResponse.data.token);
            
            // 4. Redirection vers la page des contacts
            navigate('/contacts');
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de l'inscription");
        }
    };

    return (
        <div>
            <h2>Inscription</h2>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Mot de passe:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Confirmer le mot de passe:</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">S'inscrire</button>
            </form>
            <p>
                Déjà inscrit ? <a href="/login">Se connecter</a>
            </p>
        </div>
    );
}