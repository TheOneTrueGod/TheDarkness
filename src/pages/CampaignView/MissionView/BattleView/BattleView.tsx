import React, { useEffect } from 'react';
import User from '../../../../../object_defs/User.js';
import Battle, { BattleJSONObject } from '../../../../../object_defs/Campaign/Mission/Battle/Battle';
import { CreateAPICallableState } from '../../../../components/APICallableState'
import Campaign from '../../../../../object_defs/Campaign/Campaign.js';
import Mission from '../../../../../object_defs/Campaign/Mission/Mission.js';
import GameContainer from '../../../../battle/GameContainer';
import { GetBattleParams } from '../../../../components/APITypes.js';

export type BattleViewProps = {
    user: User;
    campaign: Campaign;
    mission: Mission;
    battleId: number;
};

export type BattleNetworkResponse = {
    data: BattleJSONObject;
};

export default function BattleView ({ campaign, mission, battleId, user } : BattleViewProps) {
    const { 
        apiCallableState: battleData,
        makeCall
    } = CreateAPICallableState<GetBattleParams, Battle>(
        '/api/battle',
        Battle.fromJSONObject
    );
    useEffect(() => { makeCall({ 
        campaignId: campaign.id,
        missionId: mission.id,
        battleId,
    }) }, []);

    if (battleData.isLoading) {
        return <div>Loading...</div>;
    }

    const battle = battleData.networkObject;
    return (
        <>
            <GameContainer campaign={campaign} mission={mission} battle={battle} user={user} />
        </>
    );
};
