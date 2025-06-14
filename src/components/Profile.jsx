import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { fetchUserProfile, updateUserProfile } from '../utils/api';
import { FormWrapper, FormContainer, FormTitle, FormField, ButtonsContainer, Button } from './common/FormComponents';

/**
 * Componentes de estilo para la página de perfil de usuario
 * Diseñados para proporcionar una experiencia visual atractiva y coherente
 */
const ProfileContainer = styled(FormWrapper)`
    max-width: 1000px;
    margin: 0 auto;
`;

const ProfileCard = styled(FormContainer)`
    padding: 40px;
    width: 100%;
    max-width: 900px;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
`;

const ProfileHeader = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 40px;
    padding-bottom: 25px;
    border-bottom: 1px solid var(--border);
`;

const Avatar = styled.div`
    width: 90px;
    height: 90px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.2rem;
    font-weight: bold;
    margin-right: 25px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    border: 3px solid white;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
`;

const UserInfo = styled.div`
    flex: 1;
`;

const UserName = styled.h2`
    margin: 0;
    color: var(--primary);
    font-size: 1.8rem;
    font-weight: 600;
    letter-spacing: -0.5px;
`;

const UserEmail = styled.p`
    margin: 8px 0 0;
    color: var(--text-secondary);
    font-size: 1rem;
    display: flex;
    align-items: center;

    &::before {
        content: '✉️';
        margin-right: 8px;
        font-size: 0.9rem;
    }
`;

const SectionDivider = styled.hr`
    margin: 40px 0;
    border: 0;
    border-top: 1px solid var(--border);
    position: relative;

    &::before {
        content: '•';
        position: absolute;
        top: -10px;
        left: 50%;
        transform: translateX(-50%);
        background-color: var(--background);
        padding: 0 15px;
        color: var(--text-secondary);
    }
`;

const FormSection = styled.div`
    margin-bottom: 40px;
    background-color: ${props => props.theme === 'light' ? '#f9f9f9' : '#2a2a2a'};
    border-radius: var(--border-radius-lg);
    padding: 30px 40px;
    border: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    width: 100%;

    &:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
    }
`;

/**
 * Página de perfil de usuario
 * Permite a los usuarios ver y editar su información personal, preferencias y cambiar contraseña
 */
/**
 * Componente de perfil de usuario que permite visualizar y editar información personal,
 * preferencias de tema y cambiar la contraseña.
 * Utiliza varios contextos y hooks para gestionar el estado y las interacciones.
 */
const Profile = () => {
    // Acceso a datos y estado del usuario autenticado
    const { user, loading: authLoading } = useAuth();
    // Acceso al modo de tema actual
    const { themeMode } = useTheme();

    // Estado principal para los datos de perfil y campos de formulario
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        theme: 'light',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // Estado para controlar operaciones asíncronas
    const [loading, setLoading] = useState(false);

    // Estado para validación de campos de contraseña
    const [passwordErrors, setPasswordErrors] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    /**
     * Efecto para cargar los datos del perfil del usuario al montar el componente
     * o cuando cambia el usuario autenticado
     */
    useEffect(() => {
        const loadUserProfile = async () => {
            if (user) {
                try {
                    // Obtener datos del perfil desde la API
                    const profile = await fetchUserProfile();

                    // Actualizar el estado con los datos obtenidos o valores por defecto
                    setProfileData({
                        ...profileData,
                        name: profile.name || user.email.split('@')[0] || '',
                        email: profile.email || user.email || '',
                        theme: profile.preferences?.theme || localStorage.getItem('theme') || 'light',
                    });
                } catch (error) {
                    console.error('Error al cargar el perfil:', error);

                    // Si falla la API, utilizar datos del contexto de autenticación
                    setProfileData({
                        ...profileData,
                        name: user.name || user.email.split('@')[0] || '',
                        email: user.email || '',
                        theme: localStorage.getItem('theme') || 'light',
                    });
                    window.notifications?.error('Error al cargar el perfil');
                }
            }
        };

        loadUserProfile();
    }, [user]);

    /**
     * Maneja cambios en los campos del formulario y limpia errores asociados
     * @param {React.ChangeEvent<HTMLInputElement>} e - Evento de cambio
     */
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData({ ...profileData, [name]: value });

        // Limpiar errores de contraseña cuando el usuario escribe
        if (passwordErrors[name]) {
            setPasswordErrors({ ...passwordErrors, [name]: '' });
        }
    };

    /**
     * Maneja el cambio de tema y lo guarda en localStorage
     * @param {React.ChangeEvent<HTMLSelectElement>} e - Evento de cambio del selector
     */
    const handleThemeChange = (e) => {
        const { value } = e.target;
        setProfileData({ ...profileData, theme: value });

        try {
            // Guardar preferencia de tema en localStorage para persistencia
            localStorage.setItem('theme', value);
            // Notificación inmediata para mejor experiencia de usuario
            window.notifications.success('Tema actualizado');
        } catch (error) {
            console.error('Error al actualizar tema en localStorage:', error);
        }
    };

    /**
     * Valida los campos de contraseña antes de enviar al servidor
     * @returns {boolean} true si las validaciones pasan, false si hay errores
     */
    const validatePasswordChange = () => {
        const errors = {};

        // Validar que la contraseña actual no esté vacía
        if (!profileData.currentPassword) {
            errors.currentPassword = 'La contraseña actual es obligatoria';
        }

        // Validar la nueva contraseña
        if (!profileData.newPassword) {
            errors.newPassword = 'La nueva contraseña es obligatoria';
        } else if (profileData.newPassword.length < 6) {
            errors.newPassword = 'La contraseña debe tener al menos 6 caracteres';
        }

        // Validar que las contraseñas coincidan
        if (profileData.newPassword !== profileData.confirmPassword) {
            errors.confirmPassword = 'Las contraseñas no coinciden';
        }

        setPasswordErrors(errors);
        return Object.keys(errors).length === 0;
    };

    /**
     * Guarda los cambios en el perfil según la sección especificada
     * @param {string} section - Sección a guardar ('info' o 'preferences')
     */
    const handleSaveProfile = async (section = 'info') => {
        setLoading(true);
        try {
            // Datos a enviar según la sección que se está guardando
            let dataToSend = {};

            if (section === 'info') {
                dataToSend = { name: profileData.name };
            } else if (section === 'preferences') {
                dataToSend = { preferences: { theme: profileData.theme } };
            }

            // Enviamos los datos a la API
            const updatedProfile = await updateUserProfile(dataToSend);

            // Actualizamos los datos locales con la respuesta del servidor
            setProfileData(prevData => ({
                ...prevData,
                name: section === 'info' ? updatedProfile.name : prevData.name,
                theme: section === 'preferences' && updatedProfile.preferences?.theme
                    ? updatedProfile.preferences.theme
                    : prevData.theme
            }));

            // Mostrar mensaje de éxito específico para la sección
            const successMessage = section === 'info'
                ? 'Información personal actualizada correctamente'
                : 'Preferencias actualizadas correctamente';

            window.notifications.success(successMessage);
        } catch (error) {
            console.error(`Error al actualizar ${section}:`, error);

            // Mostrar mensaje de error específico para la sección
            const errorMessage = section === 'info'
                ? 'Error al actualizar información personal'
                : 'Error al actualizar preferencias';

            window.notifications.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Gestiona el proceso de cambio de contraseña
     * Valida los campos, envía la petición y maneja la respuesta
     */
    const handleChangePassword = async () => {
        // Validar campos antes de proceder
        if (!validatePasswordChange()) {
            return;
        }

        setLoading(true);
        try {
            // Preparar datos para la API (solo las contraseñas)
            const dataToSend = {
                currentPassword: profileData.currentPassword,
                newPassword: profileData.newPassword
            };

            // Enviar petición de cambio de contraseña
            await updateUserProfile(dataToSend);

            // Limpiar los campos de contraseña tras éxito
            setProfileData({
                ...profileData,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });

            window.notifications.success('Contraseña actualizada correctamente');
        } catch (error) {
            console.error('Error al actualizar la contraseña:', error);
            window.notifications.error('Error al actualizar la contraseña. Verifica que la contraseña actual sea correcta.');
        } finally {
            setLoading(false);
        }
    };

    // Mostrar estado de carga mientras se obtiene información del usuario
    if (authLoading) {
        return <div>Cargando perfil...</div>;
    }

    // Redirección o mensaje si no hay usuario autenticado
    if (!user) {
        return <div>Debes iniciar sesión para ver esta página</div>;
    }

    /**
     * Obtiene las iniciales del nombre para mostrar en el avatar
     * @returns {string} Inicial del nombre o "?" si no hay nombre
     */
    const getInitials = () => {
        if (!profileData.name) return '?';
        return profileData.name.charAt(0).toUpperCase();
    };

    return (
        <ProfileContainer>
            <ProfileCard width="800px">
                {/* Cabecera del perfil con avatar e información básica */}
                <ProfileHeader>
                    <Avatar>{getInitials()}</Avatar>
                    <UserInfo>
                        <UserName>{profileData.name || 'Usuario'}</UserName>
                        <UserEmail>{profileData.email}</UserEmail>
                    </UserInfo>
                </ProfileHeader>

                {/* Sección: Información Personal */}
                <FormSection theme={themeMode}>
                    <FormTitle>Información Personal</FormTitle>

                    <FormField
                        label="Nombre"
                        name="name"
                        type="text"
                        value={profileData.name}
                        onChange={handleInputChange}
                        placeholder="Tu nombre"
                    />

                    <FormField
                        label="Email"
                        name="email"
                        type="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        disabled
                        placeholder="Tu email"
                    />

                    <ButtonsContainer>
                        <Button
                            onClick={() => handleSaveProfile('info')}
                            disabled={loading}
                        >
                            {loading ? 'Guardando...' : 'Guardar Información Personal'}
                        </Button>
                    </ButtonsContainer>
                </FormSection>

                {/* Sección: Preferencias del usuario y tema */}
                <FormSection theme={themeMode}>
                    <FormTitle>Preferencias</FormTitle>

                    <FormField
                        label="Tema"
                        name="theme"
                        type="select"
                        value={profileData.theme}
                        onChange={handleThemeChange}
                    >
                        <option value="light">Claro</option>
                        <option value="dark">Oscuro</option>
                    </FormField>

                    <ButtonsContainer>
                        <Button
                            onClick={() => handleSaveProfile('preferences')}
                            disabled={loading}
                        >
                            {loading ? 'Guardando...' : 'Guardar Preferencias'}
                        </Button>
                    </ButtonsContainer>

                    <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '10px' }}>
                        Las preferencias de tema también se guardan en localStorage para persistir entre sesiones.
                    </p>
                </FormSection>

                {/* Sección: Gestión de cambio de contraseña */}
                <FormSection theme={themeMode}>
                    <FormTitle>Cambiar Contraseña</FormTitle>

                    <FormField
                        label="Contraseña Actual"
                        name="currentPassword"
                        type="password"
                        value={profileData.currentPassword}
                        onChange={handleInputChange}
                        placeholder="Introduce tu contraseña actual"
                        error={passwordErrors.currentPassword}
                    />

                    <FormField
                        label="Nueva Contraseña"
                        name="newPassword"
                        type="password"
                        value={profileData.newPassword}
                        onChange={handleInputChange}
                        placeholder="Introduce tu nueva contraseña"
                        error={passwordErrors.newPassword}
                    />

                    <FormField
                        label="Confirmar Contraseña"
                        name="confirmPassword"
                        type="password"
                        value={profileData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirma tu nueva contraseña"
                        error={passwordErrors.confirmPassword}
                    />

                    <ButtonsContainer>
                        <Button
                            onClick={handleChangePassword}
                            disabled={loading || !profileData.currentPassword || !profileData.newPassword}
                        >
                            {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
                        </Button>
                    </ButtonsContainer>
                </FormSection>

                {/* Nota informativa sobre el guardado de cambios */}
                <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '20px', textAlign: 'center' }}>
                    Todos los cambios se guardan automáticamente al hacer clic en los respectivos botones.
                </p>
            </ProfileCard>
        </ProfileContainer>
    );
};

export default Profile;
