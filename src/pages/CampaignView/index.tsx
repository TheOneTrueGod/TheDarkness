import React, { useEffect, useState } from 'react';
import Campaign from '../../../object_defs/Campaign/Campaign.js';
import MissionSelect from './MissionSelect'
import User from '../../../object_defs/User.js';
import MissionView from './MissionView/MissionView';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import { CreateAPICallableState } from '../../components/APICallableState';
import { makeAPICall } from '../../app/helpers';

export type CampaignProps = {
    user: User;
    campaignId: number;
};

export default function CampaignView ({ campaignId, user } : CampaignProps) {
    const [ joinAPICall, setJoinAPICall ] = useState({ isLoading: false, error: false });
    const { apiCallableState: campaignData, makeCall } = CreateAPICallableState<Campaign>(
        '/api/campaign',
        Campaign.fromJSONObject
    );
    useEffect(() => { makeCall({ campaignId }) }, []);

    const campaign = campaignData.networkObject;
    if (campaignData.isLoading) {
        return <div>Loading...</div>;
    }
    
    if (
        !joinAPICall.isLoading &&
        !joinAPICall.error &&
        campaign.playerIds.indexOf(user.id) === -1
    ) {
        setJoinAPICall({ isLoading: true, error: false });
        makeAPICall('/api/campaign/join', { campaignId }).then(() => {
            setJoinAPICall({ isLoading: false, error: false });
            makeCall({ campaignId });
        }).catch(() => {
            setJoinAPICall({ isLoading: false, error: true });
        });
    }

    if (joinAPICall.isLoading) {
        return <div>Joining...</div>;
    }

    if (joinAPICall.error) {
        return <div>ERROR JOINING CAMPAIGN</div>;
    }

    return (
        <>
            <Router>
                <Switch>
                    <Route path="/game/:campaignId/mission/:missionId" render={(props) =>
                        <MissionView user={user} campaignId={campaignId} missionId={props.match.params.missionId} />
                    }/>
                    <Route path="/game/:campaignId">
                        <MissionSelect user={user} campaign={campaign} />
                    </Route>
                </Switch>
            </Router>
        </>
    );
};
