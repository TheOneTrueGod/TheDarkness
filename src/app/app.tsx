import React from 'react';
import styled from 'styled-components';
import CampaignSelect from '../pages/CampaignSelect/index';
import GameView from '../pages/GameView/index';
import Login from '../pages/Login/index';
import NotFound from '../pages/NotFound/index';
import LayoutBody from '../components/layout/body';
import { makeAPICall } from './helpers';
  

const Header = styled.h1`
    display: flex;
    justify-content: center;
`;

enum Route {
    Login,
    Logout,
    CampaignSelect,
    GameView,
    NotFound,
};

interface RouteAndArgs {
    route: Route;
    campaignId?: number;
};

function getRouteAndArgs(pathname: string): RouteAndArgs {
    if (pathname.startsWith('/logout')) {
        return { route: Route.Logout };
    }

    if (pathname.startsWith('/login')) {
        return { route: Route.Login };
    }

    if (pathname === '/' || pathname === '/game' || pathname === '/game/') {
        return { route: Route.CampaignSelect };
    }

    if (pathname.startsWith("/game/")) {
        const gameId: string = pathname.match(/\d+/i)[0];
        return { route: Route.GameView, campaignId: parseInt(gameId) };
    }

    return {
        route: Route.NotFound
    }
}

export default function App () {
    const { route, campaignId } = getRouteAndArgs(window.location.pathname);
    if (route === Route.Logout) {
        makeAPICall('/api/logout', {})
            .then(() => { window.location.replace("/"); })
            .catch(() => { alert("An error occured"); });
    }
    return <>
        <Header>The Darkness</Header>
        <LayoutBody>
            { route === Route.Logout && <div>Logging out...</div>}
            { route === Route.Login && <Login /> }
            { route === Route.CampaignSelect && <CampaignSelect /> }
            { route === Route.GameView && <GameView campaignId={campaignId} /> }
            { route === Route.NotFound && <NotFound /> }
        </LayoutBody>
    </>;
};
