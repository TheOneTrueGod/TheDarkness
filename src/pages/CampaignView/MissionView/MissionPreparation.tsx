import React, { useState, useEffect } from 'react';
import Mission from "../../../../object_defs/Campaign/Mission/Mission";
import User from '../../../../object_defs/User';
import Campaign from '../../../../object_defs/Campaign/Campaign';
import CampaignUnit from '../../../../object_defs/Campaign/CampaignUnit';
import styled from 'styled-components';
import { makeAPICall } from '../../../app/helpers';

export type MissionPreparationProps = {
    user: User;
    mission: Mission;
    campaign: Campaign;
};

const UnitDiv = styled.span`
    cursor: pointer;
    padding: 4px;
    border: 1px solid gray;
    border-radius: 6px;
    margin: 2px;
`;

const UnitListContainer = styled.div`
    margin: 4px;
`;

export default function MissionPreparation ({ campaign, mission, user } : MissionPreparationProps) {
    const [unitList, setUnitList] = useState({
        mission: mission.unitList,
    });

    function addUnitToMission(unitId: number) {
        if (unitList.mission.find((missionUnit) => missionUnit.unitId === unitId)) {
            return;
        }

        const campaignUnit = campaign.campaignUnits.find((campaignUnit) => campaignUnit.unitId === unitId);

        makeAPICall('/api/missions/add-unit', {
            campaignId: campaign.id,
            missionId: mission.id,
            unitId
        }).catch(() => {
            alert("Something went wrong.  Please refresh");
        });

        setUnitList({
            mission: unitList.mission.concat([campaignUnit.makeMissionUnit()])
        });
    }

    function removeUnitFromMission(unitId: number) {
        const missionUnit = unitList.mission.find((missionUnit) => missionUnit.unitId === unitId);
        if (!missionUnit) {
            return;
        }

        makeAPICall('/api/missions/remove-unit', {
            campaignId: campaign.id,
            missionId: mission.id,
            unitId
        }).catch(() => {
            alert("Something went wrong.  Please refresh");
        });

        const missionUnitIndex = unitList.mission.indexOf(missionUnit);
        setUnitList({
            mission: unitList.mission.filter((_, i) => i !== missionUnitIndex)
        });
    }

    return (<>
        <div>Mission Prep Page</div>
        <br></br>
        <div>Participating Units:</div>
        <UnitListContainer>
            {unitList.mission.map((missionUnit) => {
                return <UnitDiv onClick={() => {
                    removeUnitFromMission(missionUnit.unitId)
                }} key={missionUnit.unitId}>
                    {missionUnit.ownerName} - {missionUnit.unitName}
                </UnitDiv>
            })}
        </UnitListContainer>
        <br></br>
        <div>Your Units:</div>
        <UnitListContainer>
            {campaign.campaignUnits.filter((campaignUnit: CampaignUnit) => {
                return campaignUnit.ownerId === user.id;
            }).map((campaignUnit: CampaignUnit) => {
                return (
                    <UnitDiv onClick={() => {
                        addUnitToMission(campaignUnit.unitId);
                    }} key={campaignUnit.unitId}>
                        { campaignUnit.unitName }
                    </UnitDiv>
                );
            })}
        </UnitListContainer>
    </>);
}