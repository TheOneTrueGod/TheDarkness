import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Campaign, { CampaignJSONObject } from '../../../object_defs/Campaign/Campaign.js';
import MissionSelect from './MissionSelect'
import { makeAPICall } from '../../app/helpers';

export type CampaignProps = {
    campaignId: number;
};

const CampaignName = styled.h2`
    text-align: center;
`;

type CampaignAPIResponse = {
    data: CampaignJSONObject,
};

export default function CampaignSelect ({ campaignId } : CampaignProps) {
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
            <CampaignName> { campaign.name } </CampaignName>
            <MissionSelect campaign={campaign} />
        </>
    );
};
