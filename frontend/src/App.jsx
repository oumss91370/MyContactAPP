import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Contacts from './pages/Contacts';
import './App.css';


function App() {
  useEffect(() => {
    console.log('URL de l\'API:', import.meta.env.VITE_API_URL);

    fetch(`${import.meta.env.VITE_API_URL}/api/auth/test`)
      .then(response => response.json())
      .then(data => console.log('Réponse du serveur:', data))
      .catch(error => console.error('Erreur de connexion:', error));
  }, []);

  return (
    <div className="app">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/contacts"
          element={
            <ProtectedRoute>
              <Contacts />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/contacts" replace />} />
      </Routes>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}
export default App;
