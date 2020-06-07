import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Campaign, { CampaignJSONObject } from '../../../object_defs/Campaign/Campaign.js';
import MissionSelect from './MissionSelect'
import { makeAPICall } from '../../app/helpers';
import User from '../../../object_defs/User.js';
import MissionView from './MissionView/MissionView';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";

export type CampaignProps = {
    user: User;
    campaignId: number;
};

type CampaignAPIResponse = {
    data: CampaignJSONObject,
};

export default function CampaignView ({ campaignId, user } : CampaignProps) {
    const [campaignData, setCampaignData] = useState({ isLoading: true, campaign: undefined });
    useEffect(() => {
        makeAPICall('/api/campaign', { campaignId })
            .then((response: CampaignAPIResponse) => {
                const campaign: Campaign = Campaign.fromJSONObject(response.data);
                setCampaignData({ isLoading: false, campaign });
            });
    }, []);

    const campaign = campaignData.campaign;

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
