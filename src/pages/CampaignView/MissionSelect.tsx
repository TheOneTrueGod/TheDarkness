import React, { useState, useEffect } from "react";
import Campaign from '../../../object_defs/Campaign/Campaign.js';
import MissionRow from './MissionRow';
import { makeAPICall } from '../../app/helpers';
import styled from 'styled-components';

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

export default function MissionSelect ({ campaign } : MissionSelectProps) {
    return (
        <OptionsContainer>
            <Full><Option onClick={() => {
                makeAPICall('/api/create-mission', { campaignId: campaign.id }).then(
                    (data: { id: number }) => {
                        window.location.href = `/game/${campaign.id}/mission/${data.id}`;
                    }
                )
            }}>Create Mission</Option></Full>

            {campaign.activeMissionIds.map(missionId => 
                <MissionRow key={missionId} campaignId={campaign.id} missionId={missionId} />
            )}

            <Full><Option onClick={() => {

            }}>End Week</Option></Full>
        </OptionsContainer>
    );
}
