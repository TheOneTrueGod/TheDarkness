import React, { useState, useEffect } from 'react';
import Campaign, { CampaignJSONObject } from '../../../object_defs/Campaign/Campaign.js'
import CampaignRow from './CampaignRow';
import { makeAPICall } from '../../app/helpers';
import styled from 'styled-components';
import User from '../../../object_defs/User.js';

export type CampaignSelectProps = {
    user: User;
};

type CampaignDetails = {
    data: { campaigns: Array<CampaignJSONObject> }
}

const CreateCampaignLink = styled.a`
    cursor: pointer;
`;

export default function CampaignSelect ({ user } : CampaignSelectProps) {
    const [campaignData, setCampaignData] = useState({ isLoading: true, campaigns: [] });
    useEffect(() => {
        makeAPICall('/api/campaign')
            .then((response: CampaignDetails) => {
                const campaignList: Array<Campaign> = [];
                response.data.campaigns.forEach((jsonObject: CampaignJSONObject) => {
                    campaignList.push(Campaign.fromJSONObject(jsonObject))
                });
                setCampaignData({ isLoading: false, campaigns: campaignList });
            });
    }, []);

    function createNewCampaign() {
        makeAPICall('/api/create-campaign', {})
        .then((response: { data: { campaignId: number } } ) => {
            console.log("Success!", response);
            debugger;
            window.location.href = `/game/${response.data.campaignId}`;
        });
    }

    return <>
        <h2>Campaign Select</h2>
        { campaignData.isLoading && <div>Loading...</div> }
        {!campaignData.isLoading && (
        <>
            { campaignData.campaigns.length <= 10 &&
                <CreateCampaignLink onClick={() => { createNewCampaign() }}>Create new Campaign</CreateCampaignLink>
            }
            <div> {
                campaignData.campaigns.map((campaign: Campaign) => {
                    return <CampaignRow key={campaign.id} campaign={campaign} />;
                })}
            </div>
        </>
        )}

    </>;
};
