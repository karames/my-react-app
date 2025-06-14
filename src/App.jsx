import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import Auth from './components/Auth';
import Create from './components/Create';
import Read from './components/Read';
import Update from './components/Update';
import Delete from './components/Delete';
import Profile from './components/Profile';
import GlobalStyles from './styles/GlobalStyles';
import styled from 'styled-components';

const NavBar = styled.nav`
    background: #007bff;
    padding: 1rem;
    display: flex;
    gap: 1rem;
    align-items: center;
    a {
        color: white;
        font-weight: bold;
    }
`;

const PrivateRoute = ({ isAuthenticated, children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [logout, setLogout] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setLogout(true);
    };

    return (
        <Router>
            <GlobalStyles />
            {logout && <Navigate to="/login" replace />}
            {isAuthenticated && (
                <NavBar>
                    <Link to="/read">Leer</Link>
                    <Link to="/create">Crear</Link>
                    <Link to="/profile">Perfil</Link>
                    <button onClick={handleLogout}>Cerrar sesión</button>
                </NavBar>
            )}
            <Routes>
                <Route path="/login" element={<Auth onLogin={() => setIsAuthenticated(true)} />} />
                <Route path="/read" element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                        <Read />
                    </PrivateRoute>
                } />
                <Route path="/create" element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                        <Create />
                    </PrivateRoute>
                } />
                <Route path="/update/:id" element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                        <Update />
                    </PrivateRoute>
                } />
                <Route path="/delete" element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                        <Delete />
                    </PrivateRoute>
                } />
                <Route path="/profile" element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                        <Profile />
                    </PrivateRoute>
                } />
                <Route path="/" element={<Navigate to="/read" />} />
            </Routes>
        </Router>
    );
};

export default App;
