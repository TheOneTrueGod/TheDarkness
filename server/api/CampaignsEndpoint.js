import Campaign from "../../object_defs/Campaign/Campaign.js";
import {
  getAllCampaignIds,
  saveCampaign,
  updateAllCampaignIds,
  loadCampaign,
  deleteCampaign,
} from "../datastore/datastore.js";
import { CreateInitialUnits } from "../../object_defs/Campaign/Campaign.js";

class CampaignsEndpoint {
  static getResponse(user, uri, request, body) {
    if (uri.startsWith("/api/delete-campaign")) {
      this.deleteCampaign(body.campaignId);
      return {};
    } else if (uri.startsWith("/api/create-campaign")) {
      const newCampaign = this.createCampaign();
      return { campaignId: newCampaign.id };
    }

    if (uri.startsWith("/api/campaign/join")) {
      this.joinCampaign(user, body.campaignId);
      return {};
    }

    if (
      request.method === "GET" ||
      (request.method === "POST" && (!body || body.campaignId === undefined))
    ) {
      return {
        campaigns: this.getAllCampaigns().map((campaign) =>
          campaign.toJSONObject()
        ),
      };
    }

    if (request.method === "POST" && body && body.campaignId !== undefined) {
      return this.getCampaign(body.campaignId).toJSONObject();
    }
  }

  static joinCampaign(user, campaignId) {
    const campaign = this.getCampaign(campaignId);
    if (campaign.playerIds.indexOf(user.id) !== -1) {
      return {};
    }

    campaign.playerIds.push(user.id);
    CreateInitialUnits(campaign, user);
    saveCampaign(campaign);
    return {};
  }

  static deleteCampaign(campaignId) {
    const campaignIds = getAllCampaignIds();
    const idIndex = campaignIds.indexOf(campaignId);
    if (idIndex == -1) {
      throw new Error(`Couldn't find campaign ${campaignId} in all Ids`);
    }

    campaignIds.splice(idIndex, 1);
    updateAllCampaignIds(campaignIds);
    deleteCampaign(campaignId);
  }

  static createCampaign() {
    const campaignIds = getAllCampaignIds();
    const newId = campaignIds.reduce((a, b) => Math.max(a, b), 0) + 1;

    if (campaignIds.length > 10) {
      throw new Error("Too many campaigns");
    }

    const newCampaign = new Campaign(newId, `Test Campaign ${newId}`);
    saveCampaign(newCampaign);
    campaignIds.push(newId);
    updateAllCampaignIds(campaignIds);

    return newCampaign;
  }

  static getCampaign(campaignId) {
    const campaignJSON = loadCampaign(campaignId);
    const campaign = Campaign.fromJSONObject(campaignJSON);
    if (campaign) {
      return campaign;
    }
    throw new Error(`Campaign '${campaignId}' not found!`);
  }

  static getAllCampaigns() {
    const campaignIds = getAllCampaignIds();
    return campaignIds.map((campaignId) => {
      return this.getCampaign(campaignId);
    });
  }
}

export { CampaignsEndpoint };
