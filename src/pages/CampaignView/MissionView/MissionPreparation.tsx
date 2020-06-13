import React, { useState, useEffect } from 'react';
import Mission from "../../../../object_defs/Campaign/Mission/Mission";
import User from '../../../../object_defs/User';

export type MissionPreparationProps = {
    user: User;
    mission: Mission;
};

export default function MissionPreparation ({ mission, user } : MissionPreparationProps) {
    
    return (<>
        <div>Mission Prep Page</div>
        <div>Participating Units:</div>
        {mission.unitList.map((missionUnit) => {
            <div>
                {missionUnit.ownerName} - {missionUnit.unitName}
            </div>
        })}
    </>);
}