import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Auth from './components/Auth';
import Create from './components/Create';
import Read from './components/Read';
import Update from './components/Update';
import Delete from './components/Delete';
import Profile from './components/Profile';
import GlobalStyles from './styles/GlobalStyles';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token); // Actualizar el estado de autenticación
    }, []); // Eliminar la dependencia innecesaria

    return (
        <Router>
            <GlobalStyles />
            <Routes>
                <Route path="/" exact element={isAuthenticated ? <Read /> : <Auth onLogin={() => setIsAuthenticated(true)} />} />
                <Route path="/create" element={isAuthenticated ? <Create /> : <Auth onLogin={() => setIsAuthenticated(true)} />} />
                <Route path="/update/:id" element={isAuthenticated ? <Update /> : <Auth onLogin={() => setIsAuthenticated(true)} />} />
                <Route path="/delete" element={isAuthenticated ? <Delete /> : <Auth onLogin={() => setIsAuthenticated(true)} />} />
                <Route path="/profile" element={isAuthenticated ? <Profile /> : <Auth onLogin={() => setIsAuthenticated(true)} />} />
            </Routes>
        </Router>
    );
};

export default App;
