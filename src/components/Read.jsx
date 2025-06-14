import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { fetchRecords } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import Delete from './Delete';

const Container = styled.div`
    padding: 20px;
`;

const RecordList = styled.ul`
    list-style-type: none;
    padding: 0;
`;

const RecordItem = styled.li`
    margin: 10px 0;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

const Read = () => {
    const [records, setRecords] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await fetchRecords();
                setRecords(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (error) {
        return <div style={{ color: 'red' }}>Error: {error}</div>;
    }

    const handleDelete = (id) => {
        setRecords(records.filter(r => r.id !== id));
    };

    return (
        <Container>
            <h2>Registros</h2>
            {loading ? <p>Cargando...</p> : (
                <RecordList>
                    {records.map(record => (
                        <RecordItem key={record.id}>
                            <h3>{record.title}</h3>
                            <p>{record.description}</p>
                            <button onClick={() => navigate(`/update/${record.id}`)}>Editar</button>
                            <Delete id={record.id} onDelete={handleDelete} />
                        </RecordItem>
                    ))}
                </RecordList>
            )}
        </Container>
    );
};

export default Read;
