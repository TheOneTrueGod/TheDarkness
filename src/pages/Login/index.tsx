import React, { useState } from 'react';
import styled from 'styled-components';
import { makeAPICall } from '../../app/helpers';

const InputSection = styled.h1`
    display: flex;
    margin: 10px 0;
`;

const ErrorDiv = styled.div`
    color: red;
    font-size: 12px;
`;

export default function Login () {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    function logIn(username: string, password: string) {
        makeAPICall('/api/login', { username, password })
            .then(() => {
                window.location.href = '/';
            })
            .catch(() => {
                setError("Username or password invalid");
            });
    }

    return (
        <>
            <h2>Login Page</h2>
            <InputSection><input name="Username" value={username} onChange={(event) => {
                setUsername(event.target.value);
            }} /></InputSection>
            <InputSection><input name="Password" value={password} onChange={(event) => {
                setPassword(event.target.value);
            }}/></InputSection>
            {error && <InputSection><ErrorDiv>{ error }</ErrorDiv></InputSection>}
            <InputSection><button onClick={() => {
                logIn(username, password);
            }}>Login</button></InputSection>
        </>
    );
};
