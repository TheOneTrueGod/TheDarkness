import React from 'react';
import styled from 'styled-components';

const InputSection = styled.h1`
    display: flex;
    margin: 10px 0;
`;

export default function Login () {
    function logIn(username: string, password: string) {
        fetch(
            '/api/login',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    username: 'TheOneTrueGod',
                    password: 'getin',
                })
            }
        )
        .then(res => res.json())
        .then(response => {
            console.log("Success!", response);
        });
    }

    return (
        <>
            <h2>Login Page</h2>
            <InputSection><input name="Username"></input></InputSection>
            <InputSection><input name="Password"></input></InputSection>
            <InputSection><button>Login</button></InputSection>
        </>
    );
};
