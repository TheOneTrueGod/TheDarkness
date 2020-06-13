import React, { useEffect } from 'react';
import User from '../../../../object_defs/User.js';
import Mission, { MissionState } from '../../../../object_defs/Campaign/Mission/Mission';
import MissionPreparation from './MissionPreparation';
import { CreateAPICallableState } from '../../../components/APICallableState'
import Campaign from '../../../../object_defs/Campaign/Campaign.js';

export type MissionProps = {
    user: User;
    campaign: Campaign;
    missionId: number;
};

export default function MissionView ({ campaign, missionId, user } : MissionProps) {
    const { apiCallableState: missionData, makeCall } = CreateAPICallableState<Mission>(
        '/api/missions',
        Mission.fromJSONObject
    );
    useEffect(() => { makeCall({ campaignId: campaign.id, missionId }) }, []);

    if (missionData.isLoading) {
        return <div>Loading...</div>;
    }

    const mission = missionData.networkObject;
    return (
        <>
            {mission.missionState === MissionState.planning && 
                <MissionPreparation campaign={campaign} mission={mission} user={user} />}
        </>
    );
};
