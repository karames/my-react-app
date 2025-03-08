import React from 'react';
import PropTypes from 'prop-types';

const Delete = ({ id, onDelete }) => {
    const handleDelete = () => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este registro?')) {
            onDelete(id);
        }
    };

    return (
        <button onClick={handleDelete} style={{ color: 'red' }}>
            Eliminar
        </button>
    );
};

Delete.propTypes = {
    id: PropTypes.number.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default Delete;
