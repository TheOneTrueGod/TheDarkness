import { UserJSONObject } from "../../object_defs/User";
import { BattleJSONObject } from "../../object_defs/Campaign/Mission/Battle/Battle";

export type GetCampaignParams = { campaignId: number };
export type GetMissionParams = { campaignId: number, missionId: number };
export type GetBattleParams = { campaignId: number, missionId: number, battleId: number };

export type SaveBattleParams = { campaignId: number, missionId: number, battleId: number, battle: BattleJSONObject };

export type GetUserParams = UserJSONObject;
