import React from 'react';

import styled from 'styled-components';

const Body = styled.div`
    width: 800px;
    margin: auto;
`;

type LayoutBodyProps = {
    children: JSX.Element | Array<JSX.Element>;
}

export default function LayoutBody ({ children }: LayoutBodyProps): JSX.Element {
    return <Body>{ children }</Body>;
}