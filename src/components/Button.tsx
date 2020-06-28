import React from 'react';

import styled from 'styled-components';

const ButtonDiv = styled.div`
    margin: auto;
`;

type ButtonProps = {
    children: JSX.Element | Array<JSX.Element>;
    onClick: Function;
}

export default function Button ({ children, onClick }: ButtonProps): JSX.Element {
    return <ButtonDiv onClick={()=> {
        onClick();
    }}>{ children }</ButtonDiv>;
}