import React, { useState, useEffect } from 'react';
import User from '../../../../object_defs/User.js';
import { makeAPICall } from '../../../app/helpers';
import Mission, { MissionJSONObject } from '../../../../object_defs/Campaign/Mission/Mission.js';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";

type MissionAPIResponse = {
    data: MissionJSONObject,
};

export type MissionProps = {
    user: User;
    campaignId: number;
    missionId: number;
};

export default function MissionView ({ campaignId, missionId, user } : MissionProps) {
    const [missionData, setMissionData] = useState({ isLoading: true, mission: undefined });
    useEffect(() => {
        makeAPICall('/api/missions', { campaignId, missionId })
            .then((response: MissionAPIResponse) => {
                const mission: Mission = Mission.fromJSONObject(response.data);
                setMissionData({ isLoading: false, mission });
            });
    }, []);

    if (missionData.isLoading) {
        return <div>Loading...</div>;
    }

    console.log(missionData.mission);
    return <div>Mission View</div>;
};
