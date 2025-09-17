import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Contacts() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ firstName: '', lastName: '', phone: '' });
    const [editingId, setEditingId] = useState(null);

    // Récupérer tous les contacts
    const fetchContacts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/api/contacts', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.ok) {
                setContacts(response.data.data);
            } else {
                throw new Error(response.data.message || 'Erreur lors du chargement des contacts');
            }
        } catch (err) {
            console.error('Erreur API:', err.response?.data || err.message);
            alert(err.response?.data?.message || 'Erreur lors du chargement des contacts');

            // Rediriger vers la page de connexion si non authentifié
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    // Créer ou mettre à jour un contact
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };

            let response;
            if (editingId) {
                // Mise à jour
                response = await axios.patch(
                    `http://localhost:3000/api/contacts/${editingId}`,
                    formData,
                    config
                );
            } else {
                // Création
                response = await axios.post(
                    'http://localhost:3000/api/contacts',
                    formData,
                    config
                );
            }

            if (response.data.ok) {
                setFormData({ firstName: '', lastName: '', phone: '' });
                setEditingId(null);
                await fetchContacts(); // Rafraîchir la liste
            } else {
                throw new Error(response.data.message || 'Erreur inconnue');
            }
        } catch (err) {
            console.error('Erreur API:', err.response?.data || err.message);
            const errorMessage = err.response?.data?.message || 'Erreur lors de la sauvegarde du contact';

            // Afficher les erreurs de validation si elles existent
            if (err.response?.data?.errors) {
                const validationErrors = Object.values(err.response.data.errors).join('\n');
                alert(`Erreurs de validation :\n${validationErrors}`);
            } else {
                alert(errorMessage);
            }
        }
    };

    // Supprimer un contact
    const handleDelete = async (id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`http://localhost:3000/api/contacts/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.ok) {
                await fetchContacts(); // Rafraîchir la liste
            } else {
                throw new Error(response.data.message || 'Erreur lors de la suppression');
            }
        } catch (err) {
            console.error('Erreur API:', err.response?.data || err.message);
            alert(err.response?.data?.message || 'Erreur lors de la suppression du contact');
        }
    };

    // Pré-remplir le formulaire pour l'édition
    const handleEdit = (contact) => {
        setFormData({
            firstName: contact.firstName,
            lastName: contact.lastName,
            phone: contact.phone
        });
        setEditingId(contact._id);
    };

    const handleChange = (e) => {
        // Validation spéciale pour le champ de téléphone
        if (e.target.name === 'phone') {
            // N'autorise que les chiffres, espaces, tirets et points
            const regex = /^[0-9\s-.]{0,10}$/;
            if (regex.test(e.target.value)) {
                setFormData({
                    ...formData,
                    [e.target.name]: e.target.value
                });
            }
        } else {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    if (loading) return <div>Chargement...</div>;

    return (
        <div>
            <header>
                <h1>Mes Contacts</h1>
                <button onClick={handleLogout}>Deconnexion</button>
            </header>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="firstName"
                    placeholder="Prénom"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="lastName"
                    placeholder="Nom"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                />
                <input
                    type="tel"
                    name="phone"
                    placeholder="Téléphone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                />
                <button type="submit">
                    {editingId ? 'Mettre à jour' : 'Ajouter'}
                </button>
                {editingId && (
                    <button type="button" onClick={() => {
                        setFormData({ firstName: '', lastName: '', phone: '' });
                        setEditingId(null);
                    }}>
                        Annuler
                    </button>
                )}
            </form>

            <ul>
                {contacts.map(contact => (
                    <li key={contact._id}>
                        {contact.firstName} {contact.lastName} - {contact.phone}
                        <button onClick={() => handleEdit(contact)}>Modifier</button>
                        <button onClick={() => handleDelete(contact._id)}>Supprimer</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}