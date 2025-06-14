import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { FormWrapper, FormContainer, FormTitle, FormField, ButtonsContainer, Button } from './common/FormComponents';

const AuthCard = styled(FormContainer)`
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    width: 350px;
    margin: 40px auto;
    padding: 30px;
`;

const AuthContainer = styled(FormWrapper)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 80vh;
`;

const Auth = () => {
    // Estado local para el formulario
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    // Estado local para validación
    const [fieldErrors, setFieldErrors] = useState({
        email: '',
        password: '',
    });

    // Usar el contexto de autenticación
    const { login, loading, error: authError, setError } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Limpiar errores cuando el usuario escribe
        if (fieldErrors[name]) {
            setFieldErrors({ ...fieldErrors, [name]: '' });
        }
    };

    const validateForm = () => {
        const errors = {};

        // Validar email
        if (!formData.email.trim()) {
            errors.email = 'El email es obligatorio';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'El email no es válido';
        }

        // Validar contraseña
        if (!formData.password.trim()) {
            errors.password = 'La contraseña es obligatoria';
        } else if (formData.password.length < 4) {
            errors.password = 'La contraseña debe tener al menos 4 caracteres';
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Limpiar errores previos del contexto

        // Validar formulario
        if (!validateForm()) return;

        // Intentar iniciar sesión
        try {
            console.log("Intentando login con:", { email: formData.email, password: "***" });
            const result = await login(formData.email, formData.password);

            if (result.success) {
                window.notifications.success('¡Bienvenido/a!');

                // Si hay una ruta de redirección después del login, navegar a ella
                if (result.redirectPath) {
                    console.log('Redirigiendo a:', result.redirectPath);
                    // Usando la API de History para navegar sin recargar la página
                    window.history.pushState({}, '', result.redirectPath);
                    // Disparar un evento para que el router de la aplicación reaccione
                    window.dispatchEvent(new Event('popstate'));
                }
                // Si no hay redirección específica, la navegación por defecto se encargará
            }
        } catch (err) {
            // El error ya se maneja en el contexto de autenticación
            console.error('Error en login:', err);

            // Podemos añadir notificación visual además del error en pantalla
            window.notifications?.error('Error al iniciar sesión');
        }
    };

    return (
        <AuthContainer>
            <AuthCard onSubmit={handleSubmit}>
                <FormTitle>Iniciar sesión</FormTitle>

                <p style={{ marginBottom: '15px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Utiliza las siguientes credenciales de prueba: <br />
                    Email: <strong>nuevo@test.com</strong> <br />
                    Password: <strong>password123</strong>
                </p>

                <FormField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={fieldErrors.email}
                    placeholder="Introduce tu email"
                    required
                    autoFocus
                />

                <FormField
                    label="Contraseña"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    error={fieldErrors.password}
                    placeholder="Introduce tu contraseña"
                    required
                />

                {authError && (
                    <p style={{ color: 'red', marginTop: '10px', fontSize: '0.9rem' }}>
                        {authError}
                    </p>
                )}

                <ButtonsContainer $align="center">
                    <Button
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                    </Button>
                </ButtonsContainer>
            </AuthCard>
        </AuthContainer>
    );
};

export default Auth;
