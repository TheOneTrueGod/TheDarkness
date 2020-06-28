import { saveDataToFile, loadDataFromFile, deleteFolderRecursive } from "./flatFileDatastore.js";

const savesDir = `./server/saves`;
const campaignIdsFile = `${savesDir}/campaigns/campaignIds.txt`;

/* campaigns */
function getFolderForCampaignId(campaignId) {
    return `${savesDir}/campaigns/campaign${campaignId}`;
}

function getFilenameForCampaignId(campaignId) {
    return `${getFolderForCampaignId(campaignId)}/campaign.txt`;
}

function loadCampaign(campaignId) {
    const fileResults = loadDataFromFile(getFilenameForCampaignId(campaignId));
    if (!fileResults) {
        return undefined;
    }
    return JSON.parse(fileResults);
};

function deleteCampaign(campaignId) {
    deleteFolderRecursive(getFolderForCampaignId(campaignId));
}

function saveCampaign(campaign) {
    const json = campaign.toJSONObject();
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

/* missions */
function getFolderForMissionId(campaignId, missionId) {
    return `${getFolderForCampaignId(campaignId)}/mission${missionId}/`;
}

function getFilenameForMission(campaignId, missionId) {
    return `${getFolderForMissionId(campaignId, missionId)}/mission.txt`;
}

function loadMission(campaignId, missionId) {
    const fileResults = loadDataFromFile(getFilenameForMission(campaignId, missionId));
    if (!fileResults) {
        return undefined;
    }
    return JSON.parse(fileResults);
}

function saveMission(mission) {
    const json = mission.toJSONObject();
    saveDataToFile(
        getFilenameForMission(mission.campaignId, mission.id),
        JSON.stringify(json)
    );
}

/* Battles */
function getFilenameForBattleId(campaignId, missionId, battleId) {
    return `${getFolderForMissionId(campaignId, missionId)}/battle${battleId}.txt`;
}

function loadBattle(campaignId, missionId, battleId) {
    const fileResults = loadDataFromFile(getFilenameForBattleId(campaignId, missionId, battleId));
    if (!fileResults) {
        return undefined;
    }
    return JSON.parse(fileResults);
}

function saveBattle(battle) {
    const json = battle.toJSONObject();
    saveDataToFile(
        getFilenameForBattleId(battle.campaignId, battle.missionId, battle.id),
        JSON.stringify(json)
    );
}

export {
    getAllCampaignIds,
    updateAllCampaignIds,

    loadCampaign, saveCampaign, deleteCampaign,

    loadMission, saveMission,

    saveBattle, loadBattle
};