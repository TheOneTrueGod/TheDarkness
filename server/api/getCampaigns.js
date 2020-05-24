import Campaign from "../../object_defs/Campaign.js";
//const { Campaign } = CampaignModule;

const campaigns = [
    new Campaign(1, 'Hardcoded Campaign 1'),
    new Campaign(2, 'Hardcoded Campaign 2'),
];

class CampaignsEndpoint {
    static getResponse(request, body) {
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

    static getCampaign(campaignId) {
        const campaign = campaigns.find(campaign => campaign.id === campaignId);
        if (campaign) {
            return campaign.toNetworkObject();
        }
        throw new Error(`Campaign '${campaignId}' not found!`);
    }

    static getCampaigns() {
        // Hardcode for now
        return { campaigns: campaigns.map(campaign => campaign.toNetworkObject()) };
    }
}

export {
    CampaignsEndpoint
};