import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

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
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error en la autenticación');
            }

            const data = await response.json().catch(() => {
                throw new Error('Respuesta del servidor no es un JSON válido');
            });

            console.log('Respuesta del servidor:', data); // Añadir log para verificar la respuesta
            localStorage.setItem('token', data.token);
            onLogin();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <AuthContainer>
            <h2>Iniciar Sesión</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <AuthForm onSubmit={handleSubmit}>
                <AuthInput
                    type="text"
                    placeholder="Usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <AuthInput
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <AuthButton type="submit">Iniciar Sesión</AuthButton>
            </AuthForm>
        </AuthContainer>
    );
};

Auth.propTypes = {
    onLogin: PropTypes.func.isRequired,
};

export default Auth;
