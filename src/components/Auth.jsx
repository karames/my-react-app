import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { login } from '../utils/api';

const AuthContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
`;

const AuthForm = styled.form`
    display: flex;
    flex-direction: column;
    width: 300px;
`;

const AuthInput = styled.input`
    margin: 10px 0;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

const AuthButton = styled.button`
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        background-color: #0056b3;
    }
`;

const Auth = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        if (!email.trim() || !password.trim()) {
            setError('Todos los campos son obligatorios');
            setLoading(false);
            return;
        }
        try {
            const data = await login(email, password);
            localStorage.setItem('token', data.token);
            onLogin();
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setError('El servidor de autenticación no está disponible. ¿Está iniciado el backend en el puerto 3001?');
            } else if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Error en la autenticación');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContainer>
            <h2>Iniciar sesión</h2>
            <AuthForm onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>
                <AuthInput
                    id="email"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    required
                />
                <label htmlFor="password">Contraseña</label>
                <AuthInput
                    id="password"
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                />
                <AuthButton type="submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</AuthButton>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </AuthForm>
        </AuthContainer>
    );
};

Auth.propTypes = {
    onLogin: PropTypes.func.isRequired,
};

export default Auth;
