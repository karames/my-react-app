import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRecord } from '../utils/api';
import { FormWrapper, FormContainer, FormTitle, FormField, ButtonsContainer, Button } from './common/FormComponents';

const Create = () => {
    const navigate = useNavigate();

    // Estado del formulario
    const [formData, setFormData] = useState({
        title: '',
        description: '',
    });

    // Estado para validación
    const [fieldErrors, setFieldErrors] = useState({
        title: '',
        description: '',
    });

    // Estado para loading y errores generales
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validar formulario
        if (!validateForm()) return;

        // Crear registro
        setLoading(true);
        try {
            await createRecord(formData);
            window.notifications.success('Registro creado correctamente');
            navigate('/read'); // Redireccionar a la lista de registros
        } catch (error) {
            setError(error.message || 'Error al crear el registro');
            window.notifications.error('Error al crear el registro');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/read');
    };

    return (
        <FormWrapper>
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

                {error && (
                    <p style={{ color: 'red', marginTop: '10px', fontSize: '0.9rem' }}>
                        {error}
                    </p>
                )}

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
