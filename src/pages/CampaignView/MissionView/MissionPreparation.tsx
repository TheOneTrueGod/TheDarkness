import React, { useState, useEffect } from 'react';
import Mission from "../../../../object_defs/Campaign/Mission/Mission";
import User from '../../../../object_defs/User';
import Campaign from '../../../../object_defs/Campaign/Campaign';
import CampaignUnit from '../../../../object_defs/Campaign/CampaignUnit';
import styled from 'styled-components';
import { makeAPICall } from '../../../app/helpers';
import { ReceiveMissionDataFunction, MissionNetworkResponse } from './MissionView';

export type MissionPreparationProps = {
    user: User;
    mission: Mission;
    campaign: Campaign;
    receiveNetworkMission: ReceiveMissionDataFunction;
};

const StartButton = styled.div`
    width: 100%;
    padding: 8px;
    border: 3px solid #7E4F68;
    border-radius: 10px;
    text-align: center;
    cursor: pointer;
`;

const UnitSlot = styled.span`
    padding: 4px;
    border: 1px solid gray;
    border-radius: 6px;
    margin: 2px;
`;

const UnitDiv = styled.span`
    cursor: pointer;
`;

const EmptyUnitDiv = styled.span`
    width: 150px;
    display: inline-block;
`;

const UnitListContainer = styled.div`
    margin: 4px;
    line-height: 40px;
`;

//export declare type StartButtonStateEnum = 'default' | 'nounits' | 'notfull' | 'starting';
enum StartButtonState {
    default='default',
    nounits='nounits',
    notfull='notfull',
    starting='starting',
};

export default function MissionPreparation ({ campaign, mission, user, receiveNetworkMission } : MissionPreparationProps) {
    const [unitList, setUnitList] = useState({
        mission: mission.caravan.unitList,
    });

    useEffect(() => {
        setUnitList({ mission: mission.caravan.unitList });
    }, [mission]);

    const [startButtonState, setStartButtonState] = useState(StartButtonState.default);

    function addUnitToMission(unitId: number) {
        if (startButtonState === StartButtonState.starting) { return; }
        setStartButtonState(StartButtonState.default);
        if (unitList.mission.find((missionUnit) => missionUnit.unitId === unitId)) {
            return;
        }

        const campaignUnit = campaign.campaignUnits.find((campaignUnit) => campaignUnit.unitId === unitId);

        makeAPICall('/api/missions/add-unit', {
            campaignId: campaign.id,
            missionId: mission.id,
            unitId
        }).then((response: MissionNetworkResponse) => {
            receiveNetworkMission(response);
        }).catch(() => {
            alert("Something went wrong.  Please refresh");
        });

        setUnitList({
            mission: unitList.mission.concat([campaignUnit.makeMissionUnit()])
        });
    }

    function removeUnitFromMission(unitId: number) {
        if (startButtonState === StartButtonState.starting) { return; }
        setStartButtonState(StartButtonState.default);
        const missionUnit = unitList.mission.find((missionUnit) => missionUnit.unitId === unitId);
        if (!missionUnit) {
            return;
        }

        makeAPICall('/api/missions/remove-unit', {
            campaignId: campaign.id,
            missionId: mission.id,
            unitId
        }).then((response: MissionNetworkResponse) => {
            receiveNetworkMission(response);
        }).catch(() => {
            alert("Something went wrong.  Please refresh");
        });

        const missionUnitIndex = unitList.mission.indexOf(missionUnit);
        setUnitList({
            mission: unitList.mission.filter((_, i) => i !== missionUnitIndex)
        });
    }

    function renderMissionSlots(): Array<JSX.Element> {
        const slotList: Array<JSX.Element> = [];
        for (let i = 0; i < mission.caravan.unitSlots; i++) {
            let unitDiv = undefined;
            if (i < unitList.mission.length) {
                const missionUnit = unitList.mission[i];
                unitDiv = (
                    <UnitDiv onClick={() => {
                        removeUnitFromMission(missionUnit.unitId)
                    }}>
                        {missionUnit.ownerName} - {missionUnit.unitName}
                    </UnitDiv>
                );
            } else {
                unitDiv = <EmptyUnitDiv/>;
            }
            slotList.push(
                <UnitSlot key={i}>
                    {unitDiv}
                </UnitSlot>
            );
        }
        return slotList;
    }

    function startMission() {
        if (
            unitList.mission.length == 0) {
            setStartButtonState(StartButtonState.nounits);
            return;
        }

        if (
            startButtonState !== StartButtonState.notfull && 
            unitList.mission.length < mission.caravan.unitSlots) {
            setStartButtonState(StartButtonState.notfull);
            return;
        }

        if (
            startButtonState === StartButtonState.starting
        ) {
            return;
        }

        makeAPICall('/api/missions/start', {
            campaignId: campaign.id,
            missionId: mission.id,
        }).then((response: MissionNetworkResponse) => {
            setStartButtonState(StartButtonState.default);
            receiveNetworkMission(response);
        }).catch(() => {
            alert('Something went wrong.  Please refresh.');
            setStartButtonState(StartButtonState.default)
        });
    }

    return (<>
        <div>Mission Prep Page</div>
        <br></br>
        <StartButton onClick={() => { startMission() }}>
            { startButtonState === StartButtonState.default && 'Start Mission' }
            { startButtonState === StartButtonState.notfull && 'There are still empty seats.  Really start?' }
            { startButtonState === StartButtonState.nounits && 'You need at least one unit to embark' }
            { startButtonState === StartButtonState.starting && 'Starting...' }
        </StartButton>
        <br></br>
        <div>Participating Units:</div>
        <UnitListContainer>
            {renderMissionSlots()}
        </UnitListContainer>
        <br></br>
        <div>Your Units:</div>
        <UnitListContainer>
            {campaign.campaignUnits.filter((campaignUnit: CampaignUnit) => {
                return campaignUnit.ownerId === user.id;
            }).map((campaignUnit: CampaignUnit) => {
                return (
                    <UnitSlot key={campaignUnit.unitId}>
                        <UnitDiv onClick={() => {
                            addUnitToMission(campaignUnit.unitId);
                        }}>
                            { campaignUnit.unitName }
                        </UnitDiv>
                    </UnitSlot>
                );
            })}
        </UnitListContainer>
    </>);
}