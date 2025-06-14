import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { api, updateRecord } from '../utils/api';

const UpdateContainer = styled.div`
    padding: 20px;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
`;

const Input = styled.input`
    margin-bottom: 10px;
    padding: 10px;
`;

const Button = styled.button`
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;

    &:hover {
        background-color: #0056b3;
    }
`;

const Update = ({ id, onUpdate }) => {
    const [data, setData] = useState({ title: '', description: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/records/${id}`);
                setData({
                    title: response.data.title || '',
                    description: response.data.description || ''
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        if (!data.title.trim() || !data.description.trim()) {
            setError('Todos los campos son obligatorios');
            setLoading(false);
            return;
        }
        try {
            await updateRecord(id, data);
            if (onUpdate) onUpdate();
        } catch (err) {
            setError(err.message || 'Error al actualizar');
        } finally {
            setLoading(false);
        }
    };

    return (
        <UpdateContainer>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {loading ? <p>Cargando...</p> : (
                <Form onSubmit={handleSubmit}>
                    <Input
                        type="text"
                        name="title"
                        value={data.title}
                        onChange={handleChange}
                        placeholder="Título"
                        required
                    />
                    <Input
                        type="text"
                        name="description"
                        value={data.description}
                        onChange={handleChange}
                        placeholder="Descripción"
                        required
                    />
                    <Button type="submit">Actualizar</Button>
                </Form>
            )}
        </UpdateContainer>
    );
};

Update.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onUpdate: PropTypes.func,
};

export default Update;
