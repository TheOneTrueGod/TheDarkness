import { CampaignsEndpoint } from './getCampaigns.js';

function getResponse(uri, request, body) {
    if (uri.startsWith('/api/get-campaign')) {
        return { data: CampaignsEndpoint.getResponse(request, body) };
    }
    throw new Error(`Resource not found: ${uri}`)
}

export default {
    getResponse
};