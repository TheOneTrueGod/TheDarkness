import React, { useState } from 'react';
import { makeAPICall } from '../../app/helpers';
import { Redirect } from 'react-router-dom';

export default function Logout () {
    const [logoutSuccess, setLogoutSuccess] = useState(false);

    makeAPICall('/api/auth/logout', {})
        .then(() => { setLogoutSuccess(true); })
        .catch(() => { alert("An error occured"); });

    return (
        <>
            <h2>Logout</h2>
            <div>Logging out...</div>
            { logoutSuccess && <Redirect to="/login" />}
        </>
    );
};
