import React, { useEffect } from 'react';
import User from '../../../../object_defs/User.js';
import Mission, { MissionState, MissionJSONObject } from '../../../../object_defs/Campaign/Mission/Mission';
import MissionPreparation from './MissionPreparation';
import { CreateAPICallableState } from '../../../components/APICallableState'
import Campaign from '../../../../object_defs/Campaign/Campaign.js';
import MissionActive from './MissionActive';
import BattleView from './BattleView/BattleView'
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import { GetMissionParams } from '../../../components/APITypes.js';

export type MissionProps = {
    user: User;
    campaign: Campaign;
    missionId: number;
};

export type MissionNetworkResponse = {
    data: MissionJSONObject;
};

export type ReceiveMissionDataFunction = (
    mission: MissionNetworkResponse,
) => void;

export default function MissionView ({ campaign, missionId, user } : MissionProps) {
    const { 
        apiCallableState: missionData,
        makeCall,
        setNetworkObject: setMissionData
    } = CreateAPICallableState<GetMissionParams, Mission>(
        '/api/missions',
        Mission.fromJSONObject
    );
    useEffect(() => { makeCall({ campaignId: campaign.id, missionId, includeAllEvents: true }) }, []);

    if (missionData.isLoading) {
        return <div>Loading...</div>;
    }

    const receiveNetworkMission: ReceiveMissionDataFunction = (newMissionData) => {
        setMissionData(Mission.fromJSONObject(newMissionData.data));
    }

    const mission = missionData.networkObject;
    return (
        <>
            <Router>
                <Switch>
                    <Route path="/game/:campaignId/mission/:missionId/battle/:battleId" render={(props) =>
                        <BattleView 
                            user={user}
                            campaign={campaign}
                            mission={mission}
                            battleId={props.match.params.battleId} 
                        />
                    }/>
                    <Route path="/game/:campaignId/mission/:missionId">
                        {mission.missionState === MissionState.planning && 
                            <MissionPreparation 
                                campaign={campaign}
                                mission={mission}
                                user={user} 
                                receiveNetworkMission={receiveNetworkMission} 
                                />}
                        {mission.missionState === MissionState.active && 
                            <MissionActive mission={mission} />
                        }
                    </Route>
                </Switch>
            </Router>
        </>
    );
};
