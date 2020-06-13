import React, { useEffect } from 'react';
import User from '../../../../object_defs/User.js';
import Mission, { MissionState } from '../../../../object_defs/Campaign/Mission/Mission';
import MissionPreparation from './MissionPreparation';
import { CreateAPICallableState } from '../../../components/APICallableState'

export type MissionProps = {
    user: User;
    campaignId: number;
    missionId: number;
};

export default function MissionView ({ campaignId, missionId, user } : MissionProps) {
    const { apiCallableState: missionData, makeCall } = CreateAPICallableState<Mission>(
        '/api/missions',
        Mission.fromJSONObject
    );
    useEffect(() => { makeCall({ campaignId, missionId }) }, []);

    if (missionData.isLoading) {
        return <div>Loading...</div>;
    }

    const mission = missionData.networkObject;

    console.log(mission);
    return (
        <>
            {mission.missionState === MissionState.planning && <MissionPreparation mission={mission} />}
        </>
    );
};
