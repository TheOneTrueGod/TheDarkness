import React from 'react';
import styled from 'styled-components';
import CampaignSelect from '../pages/CampaignSelect/index';
import GameView from '../pages/GameView/index';
import Login from '../pages/Login/login';
import Logout from '../pages/Login/logout';
import NotFound from '../pages/NotFound/index';
import LayoutBody from '../components/layout/body';
import { makeAPICall } from './helpers';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
  

const Header = styled.h1`
    display: flex;
    justify-content: center;
`;

export default function App () {
    return <>
        <Header>The Darkness</Header>
        <Router>
            <LayoutBody>
                <Switch>
                <Route path="/logout" ><Logout /></Route>
                <Route path="/login"><Login /></Route>
                <Route path="/game/:campaignId" render={(props) => {
                    const campaignId = props.match.params.campaignId;
                    return <GameView campaignId={campaignId} />
                }}/>
                <Route path="/game"><CampaignSelect /></Route>
                <Route exact path="/"><Redirect to="/game" /></Route>
                <Route path="*"><NotFound /></Route>
                </Switch>
            </LayoutBody>
        </Router>
    </>;
};
