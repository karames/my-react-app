import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { FormWrapper, FormContainer, FormTitle, FormField, ButtonsContainer, Button } from './common/FormComponents';

/**
 * Componentes de estilo para la página de autenticación
 */
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

/**
 * Componente de autenticación que gestiona el inicio de sesión del usuario
 * Incluye validación de formularios y manejo de errores
 */
const Auth = () => {
    // Estado para los datos del formulario (email y contraseña)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    // Estado para los mensajes de error de validación
    const [fieldErrors, setFieldErrors] = useState({
        email: '',
        password: '',
    });

    // Hook de autenticación para acceder a las funciones de login
    const { login, loading, error: authError, setError } = useAuth();

    /**
     * Maneja los cambios en los campos del formulario y limpia errores
     * @param {React.ChangeEvent<HTMLInputElement>} e - Evento de cambio
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Limpiar errores cuando el usuario escribe
        if (fieldErrors[name]) {
            setFieldErrors({ ...fieldErrors, [name]: '' });
        }
    };

    /**
     * Valida el formulario antes del envío
     * @returns {boolean} true si el formulario es válido, false en caso contrario
     */
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

    /**
     * Maneja el envío del formulario de inicio de sesión
     * @param {React.FormEvent} e - Evento de envío de formulario
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Limpiar errores previos del contexto

        // Validar formulario antes de procesar
        if (!validateForm()) return;

        try {
            const result = await login(formData.email, formData.password);

            if (result.success) {
                window.notifications.success('¡Bienvenido/a!');

                // Manejo de redirección post-login
                if (result.redirectPath) {
                    // Navegación SPA usando History API
                    window.history.pushState({}, '', result.redirectPath);
                    window.dispatchEvent(new Event('popstate'));
                }
            }
        } catch (err) {
            console.error('Error en login:', err);
            window.notifications?.error('Error al iniciar sesión');
        }
    };

    return (
        <AuthContainer>
            <AuthCard onSubmit={handleSubmit}>
                <FormTitle>Iniciar sesión</FormTitle>

                {/* Información de credenciales para pruebas */}
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

                {/* Mostrar mensaje de error de autenticación si existe */}
                {authError && (
                    <p style={{ color: 'red', marginTop: '10px', fontSize: '0.9rem' }}>
                        {authError}
                    </p>
                )}

                {/* Botón de envío del formulario */}
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
