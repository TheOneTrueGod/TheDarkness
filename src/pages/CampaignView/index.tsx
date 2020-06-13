import React, { useEffect } from 'react';
import Campaign, { CampaignJSONObject } from '../../../object_defs/Campaign/Campaign.js';
import MissionSelect from './MissionSelect'
import User from '../../../object_defs/User.js';
import MissionView from './MissionView/MissionView';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import { CreateAPICallableState } from '../../components/APICallableState';

export type CampaignProps = {
    user: User;
    campaignId: number;
};

type CampaignAPIResponse = {
    data: CampaignJSONObject,
};

export default function CampaignView ({ campaignId, user } : CampaignProps) {
    const { apiCallableState: campaignData, makeCall } = CreateAPICallableState<Campaign>(
        '/api/campaign',
        Campaign.fromJSONObject
    );
    useEffect(() => { makeCall({ campaignId }) }, []);

    const campaign = campaignData.networkObject;

    if (campaignData.isLoading) {
        return <div>Loading...</div>;
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
