import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Campaign, { CampaignNetworkObject } from '../../../object_defs/Campaign.js'
import { makeAPICall } from '../../app/helpers';

export type CampaignProps = {
    campaignId: number;
};

const InnerContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin: -20px;
`;

const OptionsContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
`;

const Cell = styled.div`
    padding: 20px;
`;
const Half = styled(Cell)`width: 50%;`;
const Full = styled(Cell)`width: 100%;`;

const Option = styled.div`
    border-radius: 10px;
    border: 3px solid #7E4F68;
    text-align: center;
    padding: 20px;
    cursor: pointer;
`;

const CampaignName = styled.h2`
    text-align: center;
`;

type CampaignAPIResponse = {
    data: CampaignNetworkObject,
};

export default function CampaignSelect ({ campaignId } : CampaignProps) {
    const [campaignData, setCampaignData] = useState({ isLoading: true, campaign: undefined });
    useEffect(() => {
        makeAPICall('/api/campaign', { campaignId })
            .then((response: CampaignAPIResponse) => {
                const campaign: Campaign = Campaign.fromNetworkObject(response.data);
                setCampaignData({ isLoading: false, campaign });
            });
    }, []);

    const campaign = campaignData.campaign;

    if (campaignData.isLoading) {
        return <div>Loading...</div>;
    }

    return <>
        <CampaignName> { campaign.name } </CampaignName>
        <OptionsContainer>
            <Full><Option onClick={() => {

            }}>Create Mission</Option></Full>
            <Half>
                <InnerContainer>
                    <Half><Option>View Mission 1</Option></Half>
                    <Half><Option>Cancel</Option></Half>
                </InnerContainer>
            </Half>
            <Half><Option>Join Mission 2</Option></Half>
            <Half><Option>Join Mission 3</Option></Half>
            <Full><Option onClick={() => {

            }}>End Week</Option></Full>
        </OptionsContainer>
    </>;
};
