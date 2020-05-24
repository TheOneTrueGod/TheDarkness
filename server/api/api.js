import { CampaignsEndpoint } from './CampaignsEndpoint.js';

function getResponse(uri, request, body) {
    if (
        uri.startsWith('/api/campaign') ||
        uri.startsWith('/api/create-campaign')
    ) {
        return { data: CampaignsEndpoint.getResponse(uri, request, body) };
    }

    throw new Error(`Resource not found: ${uri}`)
}

export default {
    getResponse
};