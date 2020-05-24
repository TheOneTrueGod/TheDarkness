import { saveDataToFile, loadDataFromFile } from "./flatFileDatastore.js";

function getFilenameForCampaignId(campaignId) {
    return `./server/saves/campaigns/campaign${campaignId}.txt`;
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
    
};

function updateAllCampaignIds(campaignIdList) {
    saveDataToFile(
        "saves/campaigns/campaignIds.txt",
        JSON.stringify(campaignIdList)
    );
}

export {
    loadCampaign,
    saveCampaign,
    getAllCampaignIds,
    updateAllCampaignIds
};