import { CampaignsEndpoint } from './CampaignsEndpoint.js';
import { MissionsEndpoint } from './MissionsEndpoint.js';
import { BattleEndpoint } from './BattleEndpoint.js';

function getResponse(user, uri, request, body) {
    if (
        uri.startsWith('/api/campaign') ||
        uri.startsWith('/api/create-campaign') ||
        uri.startsWith('/api/delete-campaign')
    ) {
        return { data: CampaignsEndpoint.getResponse(user, uri, request, body) };
    } else if (
        uri.startsWith('/api/missions') ||
        uri.startsWith('/api/create-mission')
    ) {
        return { data: MissionsEndpoint.getResponse(user, uri, request, body) };
    } else if (
        uri.startsWith('/api/battle')
    ) {
        return { data: BattleEndpoint.getResponse(user, uri, request, body) };
    }

    throw new Error(`Resource not found: ${uri}`)
}

export default {
    getResponse
};