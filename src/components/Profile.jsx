import React from 'react';

const Profile = () => {
    const user = {
        name: 'Gonzalo',
        email: 'gonzalo@example.com'
    };

    return (
        <div>
            <h1>Perfil</h1>
            <p>Nombre: {user.name}</p>
            <p>Email: {user.email}</p>
        </div>
    );
};

export default Profile;
