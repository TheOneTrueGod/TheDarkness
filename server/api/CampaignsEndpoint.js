import Campaign from "../../object_defs/Campaign.js";
import { getAllCampaignIds, saveCampaign, updateAllCampaignIds } from "../datastore/datastore.js";
//const { Campaign } = CampaignModule;

const campaigns = [
    new Campaign(1, 'Hardcoded Campaign 1'),
    new Campaign(2, 'Hardcoded Campaign 2'),
];

class CampaignsEndpoint {
    static getResponse(uri, request, body) {
        if (uri.startsWith('/api/create-campaign')) {
            const newCampaign = this.createCampaign();
            return { id: newCampaign.id };
        }

        if (
            request.method === 'GET' ||
            request.method === 'POST' && (!body || body.campaignId === undefined)
        ) {
            return this.getCampaigns();
        }

        if (request.method === 'POST' && body && body.campaignId !== undefined) {
            return this.getCampaign(body.campaignId);
        }
    }

    static createCampaign() {
        const campaignIds = getAllCampaignIds();
        const newId = campaignIds.reduce((a, b) => Math.max(a, b), 0) + 1;
        
        const newCampaign = new Campaign(newId, `Test Campaign ${newId}`);
        saveCampaign(newCampaign);
        campaignIds.push(newId);
        updateAllCampaignIds(campaignIds);

        return newCampaign;
    }

    static getCampaign(campaignId) {
        const campaign = campaigns.find(campaign => campaign.id === campaignId);
        if (campaign) {
            return campaign.toNetworkObject();
        }
        throw new Error(`Campaign '${campaignId}' not found!`);
    }

    static getCampaigns() {
        const campaignIds = getAllCampaignIds();
        // Hardcode for now
        return { campaigns: campaigns.map(campaign => campaign.toNetworkObject()) };
    }
}

export {
    CampaignsEndpoint
};