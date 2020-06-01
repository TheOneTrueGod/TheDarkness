import React from 'react';
import styled from 'styled-components';
import CampaignSelect from '../pages/CampaignSelect/index';
import CampaignView from '../pages/CampaignView/index';
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
                <Route path="/game/:campaignId" render={(props) =>
                    <CampaignView campaignId={props.match.params.campaignId} />
                }/>
                <Route path="/game"><CampaignSelect /></Route>
                <Route exact path="/"><Redirect to="/game" /></Route>
                <Route path="*"><NotFound /></Route>
                </Switch>
            </LayoutBody>
        </Router>
    </>;
};
