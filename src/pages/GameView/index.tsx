import React, { useState, useEffect } from 'react';
import Campaign, { CampaignNetworkObject } from '../../../object_defs/Campaign.js'

export type CampaignProps = {
    campaignId: number;
};

export default function CampaignSelect ({ campaignId } : CampaignProps) {
    const [campaignData, setCampaignData] = useState({ isLoading: true, campaign: undefined });
    useEffect(() => {
        fetch(
            '/api/get-campaign',
            { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({ campaignId })
            }
        )
        .then(res => res.json())
        .then(response => {
            const campaign: Campaign = Campaign.fromNetworkObject(response.data);
            setCampaignData({ isLoading: false, campaign });
        });
    }, []);

    const campaign = campaignData.campaign;

    return <>
        { campaignData.isLoading && <div>Loading...</div> }
        {!campaignData.isLoading && (
            <h2> { campaign.name } </h2>
        )}

    </>;
};
