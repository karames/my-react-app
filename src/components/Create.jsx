import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRecord } from '../utils/api';
import { FormWrapper, FormContainer, FormTitle, FormField, ButtonsContainer, Button } from './common/FormComponents';

/**
 * Componente que gestiona la creación de un nuevo registro
 * Incluye formulario con validación y manejo de peticiones a la API
 */
const Create = () => {
    // Hook para navegación programática
    const navigate = useNavigate();

    // Estado para almacenar los datos del formulario
    const [formData, setFormData] = useState({
        title: '',
        description: '',
    });

    // Estado para mensajes de error de validación por campo
    const [fieldErrors, setFieldErrors] = useState({
        title: '',
        description: '',
    });

    // Estados para control de la UI durante operaciones asíncronas
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    /**
     * Maneja los cambios en los campos del formulario
     * @param {React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>} e - Evento de cambio
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
     * Valida los campos del formulario antes del envío
     * @returns {boolean} true si el formulario es válido, false en caso contrario
     */
    const validateForm = () => {
        const errors = {};

        // Validar título
        if (!formData.title.trim()) {
            errors.title = 'El título es obligatorio';
        } else if (formData.title.length < 3) {
            errors.title = 'El título debe tener al menos 3 caracteres';
        }

        // Validar descripción
        if (!formData.description.trim()) {
            errors.description = 'La descripción es obligatoria';
        } else if (formData.description.length < 10) {
            errors.description = 'La descripción debe tener al menos 10 caracteres';
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    /**
     * Gestiona el envío del formulario y la creación del registro
     * @param {React.FormEvent} e - Evento de envío del formulario
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Limpiar errores previos

        // Evitar envío si hay errores de validación
        if (!validateForm()) return;

        setLoading(true);
        try {
            // Enviar datos a la API para crear el registro
            await createRecord(formData);
            window.notifications.success('Registro creado correctamente');
            navigate('/read'); // Redirigir a la lista de registros
        } catch (error) {
            setError(error.message || 'Error al crear el registro');
            window.notifications.error('Error al crear el registro');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Cancela la creación y regresa a la lista de registros
     */
    const handleCancel = () => {
        navigate('/read');
    };

    return (
        <FormWrapper>
            {/* Formulario de creación de un nuevo registro */}
            <FormContainer onSubmit={handleSubmit} $width="500px">
                <FormTitle>Crear Nuevo Registro</FormTitle>

                <FormField
                    label="Título"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    error={fieldErrors.title}
                    placeholder="Introduce el título del registro"
                    required
                    autoFocus
                />

                <FormField
                    label="Descripción"
                    name="description"
                    type="textarea"
                    value={formData.description}
                    onChange={handleChange}
                    error={fieldErrors.description}
                    placeholder="Introduce una descripción detallada"
                    required
                />

                {/* Mostrar mensaje de error general si existe */}
                {error && (
                    <p style={{ color: 'red', marginTop: '10px', fontSize: '0.9rem' }}>
                        {error}
                    </p>
                )}

                {/* Botones de acción */}
                <ButtonsContainer>
                    <Button
                        type="button"
                        $variant="secondary"
                        onClick={handleCancel}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Creando...' : 'Crear Registro'}
                    </Button>
                </ButtonsContainer>
            </FormContainer>
        </FormWrapper>
    );
};

export default Create;
