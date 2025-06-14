import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const response = await api.get('/profile');
                setUser(response.data);
            } catch (err) {
                setError('No se pudo cargar el perfil');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return <p>Cargando perfil...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!user) return null;

    return (
        <div>
            <h1>Perfil</h1>
            <p>Nombre: {user.name || user.email}</p>
            <p>Email: {user.email}</p>
        </div>
    );
};

export default Profile;
