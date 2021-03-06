import React from 'react';
import styled from 'styled-components';
import CampaignWrapper from '../pages/CampaignWrapper/CampaignWrapper'; 
import Login from '../pages/Login/login';
import Logout from '../pages/Login/logout';
import NotFound from '../pages/NotFound/index';
import LayoutBody from '../components/layout/body';

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
                <Route path="/game"><CampaignWrapper /></Route>
                <Route exact path="/"><Redirect to="/game" /></Route>
                <Route path="*"><NotFound /></Route>
                </Switch>
            </LayoutBody>
        </Router>
    </>;
};
