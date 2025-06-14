import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { fetchRecords, deleteRecord } from '../utils/api';
import { Button } from './common/FormComponents';

/**
 * Estilos para el componente de listado de registros
 */

const PageContainer = styled.div`
    padding: 20px;
    max-width: 900px;
    margin: 0 auto;
`;

const PageHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
`;

const Title = styled.h1`
    color: var(--primary);
    font-size: 1.8rem;
`;

const RecordGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
`;

const RecordCard = styled.div`
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
    transition: transform 0.2s, box-shadow 0.2s;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
`;

const CardTitle = styled.h3`
    font-size: 1.2rem;
    margin-bottom: 10px;
    color: var(--primary);
`;

const CardDescription = styled.p`
    color: #555;
    margin-bottom: 15px;
    line-height: 1.5;
`;

const CardActions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 10px;
`;

const EmptyState = styled.div`
    text-align: center;
    padding: 40px;
    background-color: #f9f9f9;
    border-radius: 8px;
`;

const LoadingWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    width: 100%;
`;

const SearchBox = styled.input`
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 20px;
    width: 300px;
    font-size: 0.9rem;
`;

/**
 * Componente que muestra el listado de todos los registros
 * Incluye funcionalidades de búsqueda, filtrado y acciones CRUD
 */
const Read = () => {
    // Estados para gestionar los datos y la interfaz
    const [records, setRecords] = useState([]);           // Todos los registros originales
    const [filteredRecords, setFilteredRecords] = useState([]);  // Registros filtrados por búsqueda
    const [searchTerm, setSearchTerm] = useState('');     // Término de búsqueda
    const [loading, setLoading] = useState(true);         // Estado de carga
    const [error, setError] = useState(null);             // Posibles errores
    const navigate = useNavigate();                       // Hook de navegación

    /**
     * Efecto para cargar los registros al montar el componente
     */
    useEffect(() => {
        const loadRecords = async () => {
            setLoading(true);
            try {
                const data = await fetchRecords();
                setRecords(data);
                setFilteredRecords(data); // Inicialmente mostrar todos los registros
            } catch (err) {
                setError(err.message);
                window.notifications.error('Error al cargar los registros');
            } finally {
                setLoading(false);
            }
        };

        loadRecords();
    }, []);

    /**
     * Efecto para filtrar registros cuando cambia el término de búsqueda
     * Busca coincidencias en título y descripción
     */
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredRecords(records);
            return;
        }

        const filtered = records.filter(record =>
            record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredRecords(filtered);
    }, [searchTerm, records]);

    /**
     * Navega a la página de edición con el ID del registro
     * @param {string|number} id - ID del registro a editar
     */
    const handleEdit = (id) => {
        navigate(`/update/${id}`);
    };

    /**
     * Elimina un registro previa confirmación
     * @param {string|number} id - ID del registro a eliminar
     */
    const handleDelete = async (id) => {
        if (!window.confirm('¿Está seguro de que desea eliminar este registro?')) {
            return;
        }

        try {
            await deleteRecord(id);
            // Actualiza el estado local para reflejar la eliminación
            setRecords(records.filter(record => record.id !== id));
            window.notifications.success('Registro eliminado correctamente');
        } catch (error) {
            window.notifications.error('Error al eliminar el registro');
        }
    };

    /**
     * Navega a la página de creación de registros
     */
    const handleCreateNew = () => {
        navigate('/create');
    };

    if (error) {
        return (
            <PageContainer>
                <EmptyState>
                    <h2 style={{ color: 'red' }}>Error al cargar los registros</h2>
                    <p>{error}</p>
                    <Button onClick={() => window.location.reload()}>
                        Intentar de nuevo
                    </Button>
                </EmptyState>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            {/* Cabecera con título y botón de creación */}
            <PageHeader>
                <Title>Mis Registros</Title>
                <Button onClick={handleCreateNew}>
                    Crear Nuevo Registro
                </Button>
            </PageHeader>

            {/* Buscador de registros */}
            <SearchBox
                type="text"
                placeholder="Buscar registros..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {loading ? (
                <LoadingWrapper>
                    <p>Cargando registros...</p>
                </LoadingWrapper>
            ) : filteredRecords.length === 0 ? (
                <EmptyState>
                    <h2>No hay registros disponibles</h2>
                    {searchTerm ? (
                        <p>No se encontraron resultados para "{searchTerm}"</p>
                    ) : (
                        <p>Crea tu primer registro haciendo clic en "Crear Nuevo Registro"</p>
                    )}
                </EmptyState>
            ) : (
                <RecordGrid>
                    {filteredRecords.map(record => (
                        <RecordCard key={record.id}>
                            <CardTitle>{record.title}</CardTitle>
                            <CardDescription>
                                {record.description}
                            </CardDescription>
                            <CardActions>
                                <Button
                                    $variant="secondary"
                                    onClick={() => handleEdit(record.id)}
                                >
                                    Editar
                                </Button>
                                <Button
                                    style={{ backgroundColor: 'var(--error)' }}
                                    onClick={() => handleDelete(record.id)}
                                >
                                    Eliminar
                                </Button>
                            </CardActions>
                        </RecordCard>
                    ))}
                </RecordGrid>
            )}
        </PageContainer>
    );
};

export default Read;
