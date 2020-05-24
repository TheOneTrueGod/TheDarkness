import React, { useState, useEffect } from 'react';
import Campaign, { CampaignNetworkObject } from '../../../object_defs/Campaign.js'
import CampaignRow from './CampaignRow';

export default function CampaignSelect () {
    const [campaignData, setCampaignData] = useState({ isLoading: true, campaigns: [] });
    useEffect(() => {
        fetch(
            '/api/get-campaign',
            { method: 'POST' }
        )
        .then(res => res.json())
        .then(response => {
            const campaignList: Array<Campaign> = [];
            response.data.campaigns.forEach((networkCampaign: CampaignNetworkObject) => {
                campaignList.push(Campaign.fromNetworkObject(networkCampaign))
            });
            setCampaignData({ isLoading: false, campaigns: campaignList });
        });
    }, []);

    return <>
        <h2>Campaign Select</h2>
        { campaignData.isLoading && <div>Loading...</div> }
        {!campaignData.isLoading && (
            <div> {
                campaignData.campaigns.map((campaign: Campaign) => {
                    return <CampaignRow campaign={campaign} />;
                })}
            </div>
        )}

    </>;
};
