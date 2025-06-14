import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchRecords, updateRecord } from '../utils/api';
import { FormWrapper, FormContainer, FormTitle, FormField, ButtonsContainer, Button } from './common/FormComponents';

/**
 * Componente para editar registros existentes
 * Carga un registro específico por ID, permite su edición y envío a la API
 */

const Update = () => {
    // Obtiene el ID del registro desde los parámetros de URL
    const { id } = useParams();
    // Hook para navegación programática
    const navigate = useNavigate();

    // Estado para los datos del formulario
    const [formData, setFormData] = useState({
        title: '',
        description: '',
    });

    // Estado para almacenar errores de validación por campo
    const [fieldErrors, setFieldErrors] = useState({
        title: '',
        description: '',
    });

    // Estados para control de UI y gestión de errores
    const [loading, setLoading] = useState(false);     // Para la actualización
    const [isFetching, setIsFetching] = useState(true); // Para la carga inicial
    const [error, setError] = useState('');            // Mensajes de error generales

    /**
     * Efecto para cargar los datos del registro al montar el componente
     * Busca el registro por ID y rellena el formulario o muestra un error
     */
    useEffect(() => {
        const fetchRecord = async () => {
            setIsFetching(true);
            try {
                // Obtenemos todos los registros y buscamos el que coincide con el ID
                const records = await fetchRecords();
                // Permitimos comparación flexible para manejar IDs numéricos o string
                const record = records.find(r => r.id === parseInt(id, 10) || r.id === id);

                if (record) {
                    // Rellenar formulario con los datos del registro
                    setFormData({
                        title: record.title || '',
                        description: record.description || ''
                    });
                } else {
                    // Manejar caso de registro no encontrado
                    setError('No se encontró el registro');
                    window.notifications.error('No se encontró el registro');
                }
            } catch (error) {
                // Manejar errores de la API
                setError(`Error al cargar el registro: ${error.message}`);
                window.notifications.error('Error al cargar el registro');
            } finally {
                setIsFetching(false);
            }
        };

        fetchRecord();
    }, [id]);

    /**
     * Maneja los cambios en los campos del formulario
     * Actualiza el estado y limpia errores en tiempo real
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
     * Valida los datos del formulario antes del envío
     * @returns {boolean} true si el formulario es válido, false si hay errores
     */
    const validateForm = () => {
        const errors = {};

        // Validación del campo título
        if (!formData.title.trim()) {
            errors.title = 'El título es obligatorio';
        } else if (formData.title.length < 3) {
            errors.title = 'El título debe tener al menos 3 caracteres';
        }

        // Validación del campo descripción
        if (!formData.description.trim()) {
            errors.description = 'La descripción es obligatoria';
        } else if (formData.description.length < 10) {
            errors.description = 'La descripción debe tener al menos 10 caracteres';
        }

        // Actualizar estado de errores y devolver resultado
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    /**
     * Maneja el envío del formulario y la actualización del registro
     * @param {React.FormEvent} e - Evento de envío del formulario
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Cancelar si hay errores de validación
        if (!validateForm()) return;

        // Proceso de actualización del registro
        setLoading(true);
        try {
            // Enviar datos actualizados a la API
            await updateRecord(id, formData);
            // Notificar éxito y redirigir a la lista de registros
            window.notifications.success('Registro actualizado correctamente');
            navigate('/read');
        } catch (error) {
            // Manejar errores de la API
            setError(error.message || 'Error al actualizar el registro');
            window.notifications.error('Error al actualizar el registro');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Cancela la edición y regresa a la lista de registros
     */
    const handleCancel = () => {
        navigate('/read');
    };

    // Mostrar indicador de carga mientras se obtienen los datos
    if (isFetching) {
        return <div>Cargando registro...</div>;
    }

    return (
        <FormWrapper>
            {/* Formulario de edición de registro */}
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

                {/* Mostrar mensaje de error si existe */}
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
                        {loading ? 'Actualizando...' : 'Actualizar Registro'}
                    </Button>
                </ButtonsContainer>
            </FormContainer>
        </FormWrapper>
    );
};

export default Update;
