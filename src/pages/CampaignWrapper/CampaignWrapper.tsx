import React, { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import { makeAPICall } from '../../app/helpers';
import User, { UserJSONObject } from '../../../object_defs/User.js';
import CampaignSelect from '../CampaignSelect/index';
import CampaignView from '../CampaignView/index';

export type CampaignWrapperProps = {
};

type UserAPIResponse = {
    data: UserJSONObject,
};

export default function CampaignWrapper ({ } : CampaignWrapperProps) {
    const [userData, setUserData] = useState({ isLoading: true, user: undefined });
    useEffect(() => {
        makeAPICall('/api/auth/get-user')
            .then((response: UserAPIResponse) => {
                const user: User = User.fromJSONObject(response.data);
                setUserData({ isLoading: false, user });
            }).catch(() => {
                setUserData({ isLoading: false, user: undefined })
            });
    }, []);

    if (userData.isLoading) {
        return <div>Loading...</div>;
    }

    if (userData.user === undefined) {
        return <Redirect to="/login" />;
    }

    return (
        <>
            <Router>
                <Switch>
                    <Route path="/game/:campaignId" render={(props) =>
                        <CampaignView user={userData.user} campaignId={props.match.params.campaignId} />
                    }/>
                    <Route path="/game"><CampaignSelect user={userData.user}  /></Route>
                </Switch>
            </Router>
        </>
    );
};
