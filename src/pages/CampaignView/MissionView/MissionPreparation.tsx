import React, { useState, useEffect } from 'react';
import Mission from "../../../../object_defs/Campaign/Mission/Mission";
import User from '../../../../object_defs/User';
import Campaign from '../../../../object_defs/Campaign/Campaign';
import CampaignUnit from '../../../../object_defs/Campaign/CampaignUnit';

export type MissionPreparationProps = {
    user: User;
    mission: Mission;
    campaign: Campaign;
};

export default function MissionPreparation ({ campaign, mission, user } : MissionPreparationProps) {
    console.log(campaign);
    return (<>
        <div>Mission Prep Page</div>
        <br></br>
        <div>Participating Units:</div>
        {mission.unitList.map((missionUnit) => {
            <div>
                {missionUnit.ownerName} - {missionUnit.unitName}
            </div>
        })}
        <br></br>
        <div>Your Units:</div>
        {campaign.campaignUnits.filter((campaignUnit: CampaignUnit) => {
            console.log(campaignUnit.ownerId, user.id);
            return campaignUnit.ownerId === user.id;
        }).map((campaignUnit: CampaignUnit) => {
            return (
                <div key={campaignUnit.unitId}>
                    { campaignUnit.unitName }
                </div>
            );
        })}
    </>);
}