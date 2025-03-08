import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

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
    const [data, setData] = useState({ name: '', email: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/users/${id}`);
                if (!response.ok) throw new Error('Error fetching data');
                const result = await response.json();
                setData(result);
            } catch (err) {
                setError(err.message);
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
        try {
            const response = await fetch(`http://localhost:3000/users/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('Error updating data');
            onUpdate();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <UpdateContainer>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <Form onSubmit={handleSubmit}>
                <Input
                    type="text"
                    name="name"
                    value={data.name}
                    onChange={handleChange}
                    placeholder="Name"
                    required
                />
                <Input
                    type="email"
                    name="email"
                    value={data.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                />
                <Button type="submit">Update</Button>
            </Form>
        </UpdateContainer>
    );
};

Update.propTypes = {
    id: PropTypes.number.isRequired,
    onUpdate: PropTypes.func.isRequired,
};

export default Update;
