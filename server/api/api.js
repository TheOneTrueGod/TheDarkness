import { CampaignsEndpoint } from './getCampaigns.js';

//const { getCampaigns } = getCampaignModule;

function getResponse(uri, request) {
    if (uri.startsWith('/api/get-campaigns')) {
        return { data: CampaignsEndpoint.getResponse(request) };
    }
    throw new Error(`Resource not found: ${uri}`)
}

export default {
    getResponse
};