import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

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

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const response = await fetch('http://localhost:3000/records');
                if (!response.ok) {
                    throw new Error('Error fetching records');
                }

                const text = await response.text();
                if (!text) {
                    throw new Error('Respuesta del servidor está vacía');
                }

                const data = JSON.parse(text);
                setRecords(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchRecords();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Container>
            <h2>Records</h2>
            <RecordList>
                {records.map(record => (
                    <RecordItem key={record.id}>
                        <h3>{record.title}</h3>
                        <p>{record.description}</p>
                    </RecordItem>
                ))}
            </RecordList>
        </Container>
    );
};

Read.propTypes = {
    records: PropTypes.array,
};

export default Read;
