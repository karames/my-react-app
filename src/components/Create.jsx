import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { createRecord } from '../utils/api';

const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    width: 300px;
`;

const Input = styled.input`
    margin: 10px 0;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

const Button = styled.button`
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

const Create = ({ onCreate }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        if (!formData.title.trim() || !formData.description.trim()) {
            setError('Todos los campos son obligatorios');
            setLoading(false);
            return;
        }
        try {
            const newRecord = await createRecord(formData);
            if (onCreate) onCreate(newRecord);
            setFormData({ title: '', description: '' });
            setSuccess('Registro creado correctamente');
        } catch (error) {
            setError(error.message || 'Error al crear el registro');
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormContainer>
            <h2>Crear Registro</h2>
            <Form onSubmit={handleSubmit}>
                <Input
                    type="text"
                    name="title"
                    placeholder="Título"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
                <Input
                    type="text"
                    name="description"
                    placeholder="Descripción"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />
                <Button type="submit" disabled={loading}>{loading ? 'Creando...' : 'Crear'}</Button>
            </Form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
        </FormContainer>
    );
};

Create.propTypes = {
    onCreate: PropTypes.func,
};

export default Create;
