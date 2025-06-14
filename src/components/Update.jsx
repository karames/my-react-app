import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchRecords, updateRecord } from '../utils/api';
import { FormWrapper, FormContainer, FormTitle, FormField, ButtonsContainer, Button } from './common/FormComponents';

const Update = () => {
    const { id } = useParams();
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

    // Estado para loading y errores
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState('');

    // Obtener datos del registro
    useEffect(() => {
        const fetchRecord = async () => {
            setIsFetching(true);
            try {
                const records = await fetchRecords();
                const record = records.find(r => r.id === parseInt(id, 10) || r.id === id);

                if (record) {
                    setFormData({
                        title: record.title || '',
                        description: record.description || ''
                    });
                } else {
                    setError('No se encontró el registro');
                    window.notifications.error('No se encontró el registro');
                }
            } catch (error) {
                setError(`Error al cargar el registro: ${error.message}`);
                window.notifications.error('Error al cargar el registro');
            } finally {
                setIsFetching(false);
            }
        };

        fetchRecord();
    }, [id]);

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

        // Actualizar registro
        setLoading(true);
        try {
            await updateRecord(id, formData);
            window.notifications.success('Registro actualizado correctamente');
            navigate('/read');
        } catch (error) {
            setError(error.message || 'Error al actualizar el registro');
            window.notifications.error('Error al actualizar el registro');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/read');
    };

    if (isFetching) {
        return <div>Cargando registro...</div>;
    }

    return (
        <FormWrapper>
            <FormContainer onSubmit={handleSubmit} $width="500px">
                <FormTitle>Editar Registro</FormTitle>

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
                        {loading ? 'Actualizando...' : 'Actualizar Registro'}
                    </Button>
                </ButtonsContainer>
            </FormContainer>
        </FormWrapper>
    );
};

export default Update;
