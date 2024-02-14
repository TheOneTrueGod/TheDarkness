import React, { useEffect } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import User, { UserJSONObject } from '../../../object_defs/User.js';
import CampaignSelect from '../CampaignSelect/index';
import CampaignView from '../CampaignView/index';
import { CreateAPICallableState } from '../../components/APICallableState';
import { GetUserParams } from '../../components/APITypes.js';

export type CampaignWrapperProps = {
};

export default function CampaignWrapper ({ } : CampaignWrapperProps) {
    const { apiCallableState: userData, makeCall } = CreateAPICallableState<GetUserParams, User>(
        '/api/auth/get-user',
        User.fromJSONObject
    );
    useEffect(() => { makeCall({}) }, []);

    if (userData.isLoading) {
        return <div>Loading...</div>;
    }

    const user = userData.networkObject;

    if (user === undefined) {
        return <Redirect to="/login" />;
    }

    return (
        <>
            <Router>
                <Switch>
                    <Route path="/game/:campaignId" render={(props) =>
                        <CampaignView user={user} campaignId={props.match.params.campaignId} />
                    }/>
                    <Route path="/game"><CampaignSelect user={user}  /></Route>
                </Switch>
            </Router>
        </>
    );
};
