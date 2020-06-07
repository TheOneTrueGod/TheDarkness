import React from "react";
import DataLoader from "../../components/DataLoader/dataLoader";
import MissionInterface from "../../../object_defs/Campaign/Mission/Mission.js";
import styled from 'styled-components';
import { getMissionUrl } from "./MissionSelect";
import { Link } from "react-router-dom";
import User from '../../../object_defs/User.js';

const InnerContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin: -20px;
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

export type MissionRowProps = {
    user: User;
    missionId: number;
    campaignId: number;
};

export default function MissionRow ({ campaignId, missionId, user } : MissionRowProps) {
    return (
        <DataLoader apiURL={'/api/missions'} args={{ campaignId, missionId }}>
            {(mission: MissionInterface) => {
                if (mission.creatorId === user.id) {
                    return (
                        <Half>
                            <Link to={getMissionUrl(campaignId, missionId)}>
                                <Option>View Mission { mission.id }</Option>
                            </Link>
                        </Half>
                    );
                }
                return (
                    <Half><Link to={getMissionUrl(campaignId, missionId)}>
                        <Option>Join Mission { mission.id }</Option>
                    </Link></Half>
                );
            }}
        </DataLoader>
    );
}