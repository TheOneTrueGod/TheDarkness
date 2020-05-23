import React from 'react';
import styled from 'styled-components';
import CampaignSelect from '../pages/CampaignSelect/index';
import Login from '../pages/Login/index';
import NotFound from '../pages/NotFound/index';
  

const Header = styled.h1`
    display: flex;
    justify-content: center;
`;

enum Route {
    Login,
    CampaignSelect,
    NotFound,
};

interface RouteAndArgs {
    route: Route;
    args?: Object;
};

function getRouteAndArgs(pathname: string): RouteAndArgs {
    if (pathname.startsWith('/login')) {
        return { route: Route.Login };
    }

    if (pathname === '/' || pathname === '/game') {
        return { route: Route.CampaignSelect };
    }

    return {
        route: Route.NotFound
    }
}

export default function App () {
    const { route, args } = getRouteAndArgs(window.location.pathname);
    return <>
        <Header>The Darkness</Header>
        <div>
            { route === Route.Login && <Login /> }
            { route === Route.CampaignSelect && <CampaignSelect /> }
            { route === Route.NotFound && <NotFound /> }
        </div>
    </>;
};
