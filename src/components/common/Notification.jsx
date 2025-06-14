import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';

// Keyframes para las animaciones de entrada, salida y barra de progreso
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-10px);
  }
`;

const progress = keyframes`
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
`;

const NotificationContainer = styled.div`
    position: fixed;
    top: 20px;
    right: 20px;
    width: 300px;
    z-index: 1000;

    /* Aseguramos que los estilos de notificación tienen prioridad */
    && {
        h4, p, button {
            color: inherit;
        }
    }
`;

const NotificationItem = styled.div`
    margin-bottom: 10px;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    position: relative;
    overflow: hidden;
    background-color: ${props => {
        // Mismos colores de fondo independientemente del tema
        switch (props.$type) {
            case 'success': return '#d4edda';
            case 'error': return '#f8d7da';
            case 'warning': return '#fff3cd';
            case 'info':
            default: return '#cce5ff';
        }
    }};
    color: ${props => {
        // Mismos colores de texto independientemente del tema
        switch (props.$type) {
            case 'success': return '#155724';
            case 'error': return '#721c24';
            case 'warning': return '#856404';
            case 'info':
            default: return '#004085';
        }
    }};
    border-left: 5px solid ${props => {
        switch (props.$type) {
            case 'success': return '#28a745';
            case 'error': return '#dc3545';
            case 'warning': return '#ffc107';
            case 'info':
            default: return '#007bff';
        }
    }};
    animation: ${props => props.$isExiting ? fadeOut : fadeIn} 0.3s ease;
`;

const ProgressBar = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    background-color: ${props => {
        switch (props.$type) {
            case 'success': return '#28a745';
            case 'error': return '#dc3545';
            case 'warning': return '#ffc107';
            case 'info':
            default: return '#007bff';
        }
    }};
    animation: ${progress} ${props => props.$duration}ms linear;
    opacity: 0.8;
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    font-size: 16px;
    margin-left: auto;
    cursor: pointer;
    color: inherit;
    opacity: 0.7;

    &:hover {
        opacity: 1;
    }
`;

const MessageContainer = styled.div`
    flex: 1;
`;

const NotificationTitle = styled.h4`
    margin: 0 0 5px 0;
    font-size: 14px;
    font-weight: 600;
    color: inherit;
`;

const NotificationMessage = styled.p`
    margin: 0;
    font-size: 13px;
    color: inherit;
`;

/**
 * Componente que muestra una notificación individual con animaciones de entrada/salida
 * @param {string|number} id - Identificador único de la notificación
 * @param {string} type - Tipo de notificación: 'success', 'error', 'warning', 'info'
 * @param {string} title - Título opcional de la notificación
 * @param {string} message - Mensaje de la notificación
 * @param {number} duration - Duración en ms antes de cerrarse automáticamente (0 para persistir)
 * @param {function} onClose - Función a ejecutar cuando se cierra la notificación
 * @param {boolean} isExiting - Indica si la notificación está en proceso de desaparición
 */
const Notification = ({ id, type, title, message, duration, onClose, isExiting }) => {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onClose(id);
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [duration, onClose, id]);

    return (
        <NotificationItem $type={type} $isExiting={isExiting}>
            <MessageContainer>
                {title && <NotificationTitle>{title}</NotificationTitle>}
                <NotificationMessage>{message}</NotificationMessage>
            </MessageContainer>
            <CloseButton onClick={() => onClose(id)}>×</CloseButton>
            {duration > 0 && <ProgressBar $type={type} $duration={duration} />}
        </NotificationItem>
    );
};

Notification.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
    title: PropTypes.string,
    message: PropTypes.string.isRequired,
    duration: PropTypes.number,
    onClose: PropTypes.func.isRequired,
    isExiting: PropTypes.bool,
};

Notification.defaultProps = {
    type: 'info',
    duration: 5000,
    isExiting: false,
};

/**
 * Componente contenedor que gestiona el estado global de notificaciones
 * Expone en window.notifications los métodos:
 * - success(message, title, duration): muestra notificación de éxito
 * - error(message, title, duration): muestra notificación de error
 * - warning(message, title, duration): muestra notificación de advertencia
 * - info(message, title, duration): muestra notificación informativa
 * - clear(): elimina todas las notificaciones activas
 */
const NotificationManager = () => {
    const [notifications, setNotifications] = useState([]);
    const [exitingIds, setExitingIds] = useState(new Set());

    // Cierra una notificación con animación de salida
    const handleClose = (id) => {
        // Marca la notificación como saliente para animar su salida
        setExitingIds(prev => new Set([...prev, id]));

        // Elimina la notificación del estado después de completar la animación
        setTimeout(() => {
            setNotifications(prev => prev.filter(notif => notif.id !== id));
            setExitingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            });
        }, 300);
    };

    // Añade una nueva notificación con ID único y la agrega al estado
    const addNotification = (notification) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { ...notification, id }]);
        return id;
    };

    // Expone la API de notificaciones en window.notifications
    useEffect(() => {
        // Configura la duración predeterminada en 5 segundos
        const defaultDuration = 5000;

        window.notifications = {
            success: (message, title, duration) =>
                addNotification({ type: 'success', message, title, duration: duration || defaultDuration }),
            error: (message, title, duration) =>
                addNotification({ type: 'error', message, title, duration: duration || defaultDuration }),
            warning: (message, title, duration) =>
                addNotification({ type: 'warning', message, title, duration: duration || defaultDuration }),
            info: (message, title, duration) =>
                addNotification({ type: 'info', message, title, duration: duration || defaultDuration }),
            clear: () => setNotifications([])
        };

        return () => {
            delete window.notifications;
        };
    }, []);

    return (
        <NotificationContainer>
            {notifications.map(notification => (
                <Notification
                    key={notification.id}
                    {...notification}
                    onClose={handleClose}
                    isExiting={exitingIds.has(notification.id)}
                />
            ))}
        </NotificationContainer>
    );
};

export { NotificationManager, Notification };
