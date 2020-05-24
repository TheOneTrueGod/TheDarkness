import { saveDataToFile, loadDataFromFile } from "./flatFileDatastore.js";

const savesDir = `./server/saves`;
const campaignIdsFile = `${savesDir}/campaigns/campaignIds.txt`;

function getFilenameForCampaignId(campaignId) {
    return `${savesDir}/campaigns/campaign${campaignId}.txt`;
}

function loadCampaign(campaignId) {
    const fileResults = loadDataFromFile(getFilenameForCampaignId(campaignId));
    if (!fileResults) {
        return undefined;
    }
    return JSON.parse(fileResults);
};

function saveCampaign(campaign) {
    const json = campaign.toJsonObject();
    saveDataToFile(
        getFilenameForCampaignId(campaign.id),
        JSON.stringify(json)
    );
};

function getAllCampaignIds() {
    const fileResults = loadDataFromFile(campaignIdsFile);
    if (!fileResults) { return []; }
    return JSON.parse(fileResults);
};

function updateAllCampaignIds(campaignIdList) {
    saveDataToFile(
        campaignIdsFile,
        JSON.stringify(campaignIdList)
    );
}

export {
    loadCampaign,
    saveCampaign,
    getAllCampaignIds,
    updateAllCampaignIds
};