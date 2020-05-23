import Campaign from "../../object_defs/Campaign.js";
//const { Campaign } = CampaignModule;

class CampaignsEndpoint {
    static getResponse(request) {
        if (request.method === 'GET') {
            return this.getCampaigns();;
        }
    }

    static getCampaigns() {
        // Hardcode for now
        const campaigns = [
            new Campaign('Hardcoded Campaign 1'),
            new Campaign('Hardcoded Campaign 2'),
        ];
        return { campaigns: campaigns.map(campaign => campaign.toNetworkObject()) };
    }
}

export {
    CampaignsEndpoint
};