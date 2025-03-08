import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

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
        content: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/records', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error('Error en la creación del registro');
            }
            const data = await response.json();
            onCreate(data);
            setFormData({ title: '', content: '' });
        } catch (error) {
            console.error('Error:', error);
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
                    name="content"
                    placeholder="Contenido"
                    value={formData.content}
                    onChange={handleChange}
                    required
                />
                <Button type="submit">Crear</Button>
            </Form>
        </FormContainer>
    );
};

Create.propTypes = {
    onCreate: PropTypes.func.isRequired,
};

export default Create;
