import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { deleteRecord } from '../utils/api';

const DeleteButton = styled.button`
    color: white;
    background: #dc3545;
    margin-left: 8px;
    &:hover {
        background: #b52a37;
    }
`;

const Delete = ({ id, onDelete }) => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const handleDelete = async () => {
        setError('');
        if (window.confirm('¿Estás seguro de que deseas eliminar este registro?')) {
            setLoading(true);
            try {
                await deleteRecord(id);
                onDelete(id);
            } catch (err) {
                setError(err.message || 'Error al eliminar');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <>
            <DeleteButton onClick={handleDelete} disabled={loading}>
                {loading ? 'Eliminando...' : 'Eliminar'}
            </DeleteButton>
            {error && <span style={{ color: 'red', marginLeft: 8 }}>{error}</span>}
        </>
    );
};

Delete.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default Delete;
