import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationManager } from './components/common/Notification';

// Componentes
import Auth from './components/Auth';
import Create from './components/Create';
import Read from './components/Read';
import Update from './components/Update';
import Profile from './components/Profile';
import GlobalStyles from './styles/GlobalStyles';

// Estilos
const AppContainer = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
`;

const NavBar = styled.nav`
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    padding: 1rem 2rem;
    display: flex;
    gap: 1.5rem;
    align-items: center;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
    position: sticky;
    top: 0;
    z-index: 100;

    a {
        color: white;
        font-weight: 600;
        text-decoration: none;
        padding: 8px 16px;
        border-radius: 20px;
        transition: all 0.3s ease;
        position: relative;

        &:hover {
            background-color: rgba(255, 255, 255, 0.15);
            transform: translateY(-2px);
            box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
        }

        &:active {
            transform: translateY(0);
        }

        &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 2px;
            background-color: white;
            transition: width 0.3s;
        }

        &:hover::after {
            width: 70%;
        }
    }
`;

const LogoutButton = styled.button`
    margin-left: auto;
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.6);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    font-weight: 600;

    &:hover {
        background-color: rgba(255, 255, 255, 0.25);
        transform: translateY(-2px);
        box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
    }

    &:active {
        transform: translateY(0);
    }

    &::before {
        content: '⟲';
        margin-right: 6px;
        font-size: 14px;
    }
`;

const MainContent = styled.main`
    flex: 1;
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
`;

const Footer = styled.footer`
    background-color: #f5f5f5;
    padding: 1rem;
    text-align: center;
    font-size: 0.9rem;
    color: #666;
`;

// Componente para rutas protegidas
const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" />;
};

// Componente principal de navegación
const Navigation = () => {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        window.notifications.success('Has cerrado sesión correctamente');
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Buenos días';
        if (hour < 18) return 'Buenas tardes';
        return 'Buenas noches';
    };

    return (
        <NavBar>
            <Link to="/read">Registros</Link>
            <Link to="/profile">Perfil</Link>
            {user && (
                <>
                    <span style={{
                        marginLeft: 'auto',
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '0.9rem'
                    }}>
                        {getGreeting()}, {user.name || user.email.split('@')[0]}
                    </span>
                    <LogoutButton onClick={handleLogout}>
                        Cerrar sesión
                    </LogoutButton>
                </>
            )}
        </NavBar>
    );
};

// Componente principal
const AppContent = () => {
    const { isAuthenticated } = useAuth();

    return (
        <Router>
            <AppContainer>
                <GlobalStyles />
                {isAuthenticated && <Navigation />}
                <MainContent>
                    <Routes>
                        <Route
                            path="/login"
                            element={isAuthenticated ? <Navigate to="/" /> : <Auth />}
                        />
                        <Route path="/read" element={
                            <PrivateRoute>
                                <Read />
                            </PrivateRoute>
                        } />
                        <Route path="/create" element={
                            <PrivateRoute>
                                <Create />
                            </PrivateRoute>
                        } />
                        <Route path="/update/:id" element={
                            <PrivateRoute>
                                <Update />
                            </PrivateRoute>
                        } />
                        <Route path="/profile" element={
                            <PrivateRoute>
                                <Profile />
                            </PrivateRoute>
                        } />
                        <Route path="/" element={<Navigate to="/read" />} />
                        <Route path="*" element={
                            <div>
                                <h1>404 - Página no encontrada</h1>
                                <p>La página que buscas no existe.</p>
                                <Link to="/">Volver al inicio</Link>
                            </div>
                        } />
                    </Routes>
                </MainContent>
                <Footer>
                    © {new Date().getFullYear()} Gonzalo Rodríguez de Dios Cabrera - App React - Todos los derechos reservados
                </Footer>
            </AppContainer>
            <NotificationManager />
        </Router>
    );
};

// Aplicación con proveedores de contexto
const App = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};

export default App;
