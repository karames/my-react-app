import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { deleteRecord } from '../utils/api';
import { Button } from './common/FormComponents';

const DeleteContainer = styled.div`
    display: inline-block;
`;

const DeleteButton = styled(Button)`
    background-color: var(--error);
    margin-left: 8px;

    &:hover {
        background-color: #b52a37;
    }

    &:disabled {
        background-color: rgba(220, 53, 69, 0.7);
    }
`;

const ErrorMessage = styled.span`
    color: var(--error);
    margin-left: 8px;
    font-size: 0.85rem;
`;

/**
 * Componente para eliminar un registro
 *
 * @param {Object} props - Propiedades del componente
 * @param {string|number} props.id - ID del registro a eliminar
 * @param {Function} props.onDelete - Función a llamar después de eliminar
 * @param {string} [props.buttonText="Eliminar"] - Texto del botón
 * @param {boolean} [props.confirmDelete=true] - Si debe mostrar confirmación
 * @param {string} [props.confirmMessage="¿Estás seguro de que deseas eliminar este registro?"] - Mensaje de confirmación
 * @returns {JSX.Element}
 */
const Delete = ({
    id,
    onDelete,
    buttonText = "Eliminar",
    confirmDelete = true,
    confirmMessage = "¿Estás seguro de que deseas eliminar este registro?",
    size = "small"
}) => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    /**
     * Maneja el proceso de eliminación de un registro
     * Incluye confirmación, llamada a API, notificación y callback
     */
    const handleDelete = async () => {
        setError('');

        // Confirmar antes de eliminar si está habilitada la confirmación
        if (confirmDelete && !window.confirm(confirmMessage)) {
            return;
        }

        setLoading(true);
        try {
            await deleteRecord(id);

            // Mostrar notificación de éxito
            if (window.notifications) {
                window.notifications.success('Registro eliminado correctamente');
            }

            // Ejecutar callback proporcionado por el componente padre
            if (onDelete) {
                onDelete(id);
            }
        } catch (err) {
            const errorMessage = err.message || 'Error al eliminar el registro';
            setError(errorMessage);


            if (window.notifications) {
                window.notifications.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <DeleteContainer>
            {/* Botón para iniciar el proceso de eliminación */}
            <DeleteButton
                onClick={handleDelete}
                disabled={loading}
                size={size}
            >
                {loading ? 'Eliminando...' : buttonText}
            </DeleteButton>
            {error && <ErrorMessage>{error}</ErrorMessage>}
        </DeleteContainer>
    );
};

Delete.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onDelete: PropTypes.func.isRequired,
    buttonText: PropTypes.string,
    confirmDelete: PropTypes.bool,
    confirmMessage: PropTypes.string,
    size: PropTypes.oneOf(['small', 'medium', 'large']),
};

export default Delete;
