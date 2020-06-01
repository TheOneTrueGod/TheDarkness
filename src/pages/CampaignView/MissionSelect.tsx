import React, { useState, useEffect } from "react";
import Campaign from '../../../object_defs/Campaign/Campaign.js';
import MissionRow from './MissionRow';
import { makeAPICall } from '../../app/helpers';
import styled from 'styled-components';

import { Redirect } from "react-router-dom";

const InnerContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin: -20px;
`;

const OptionsContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
`;

const Cell = styled.div`
    padding: 20px;
`;
const Half = styled(Cell)`width: 50%;`;
const Full = styled(Cell)`width: 100%;`;

const Option = styled.div`
    border-radius: 10px;
    border: 3px solid #7E4F68;
    text-align: center;
    padding: 20px;
    cursor: pointer;
`;

export type MissionSelectProps = {
    campaign: Campaign;
};

export function getMissionUrl(campaignId: number, missionId: number): string {
    return `/game/${campaignId}/mission/${missionId}`;
}

export default function MissionSelect ({ campaign } : MissionSelectProps) {
    const [createMissionAPICall, setCreateMissionAPICall] 
        = useState({ isLoading: false, newMissionId: -1 });
    
    if (createMissionAPICall.newMissionId !== -1) {
        return <Redirect to={getMissionUrl(campaign.id, createMissionAPICall.newMissionId)} />;
    }

    return (
        <OptionsContainer>
            <Full><Option onClick={() => {
                setCreateMissionAPICall({ ...createMissionAPICall, isLoading: true});

                makeAPICall('/api/create-mission', { campaignId: campaign.id }).then(
                    (data: { data: { missionId: number } }) => {
                        setCreateMissionAPICall({ 
                            newMissionId: data.data.missionId,
                            isLoading: false
                        });
                    }
                )
            }}>Create Mission</Option></Full>

            {campaign.activeMissionIds.map(missionId => 
                <MissionRow 
                    key={missionId}
                    campaignId={campaign.id}
                    missionId={missionId}
                />
            )}

            <Full><Option onClick={() => {

            }}>End Week</Option></Full>
        </OptionsContainer>
    );
}
