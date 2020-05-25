import React, { useState, useEffect } from 'react';
import Campaign, { CampaignNetworkObject } from '../../../object_defs/Campaign.js'
import CampaignRow from './CampaignRow';
import { makeAPICall } from '../../app/helpers';

type CampaignDetails = {
    data: {
        campaigns: Array<CampaignNetworkObject>
    }
}

export default function CampaignSelect () {
    const [campaignData, setCampaignData] = useState({ isLoading: true, campaigns: [] });
    useEffect(() => {
        makeAPICall('/api/campaign')
            .then((response: CampaignDetails) => {
                const campaignList: Array<Campaign> = [];
                response.data.campaigns.forEach((networkCampaign: CampaignNetworkObject) => {
                    campaignList.push(Campaign.fromNetworkObject(networkCampaign))
                });
                setCampaignData({ isLoading: false, campaigns: campaignList });
            });
    }, []);

    function createNewCampaign() {
        makeAPICall('/api/create-campaign', {})
        .then(response => {
            console.log("Success!", response);
        });
    }

    return <>
        <h2>Campaign Select</h2>
        { campaignData.isLoading && <div>Loading...</div> }
        {!campaignData.isLoading && (
        <>
            {campaignData.campaigns.length <= 10 && <div onClick={() => { createNewCampaign() }}>Create new Campaign</div>}
            <div> {
                campaignData.campaigns.map((campaign: Campaign) => {
                    return <CampaignRow campaign={campaign} />;
                })}
            </div>
        </>
        )}

    </>;
};
