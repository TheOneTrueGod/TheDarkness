import React, { useState, useEffect } from 'react';
import Mission from "../../../../object_defs/Campaign/Mission/Mission";

export type MissionPreparationProps = {
    mission: Mission;
};

export default function MissionPreparation ({ mission } : MissionPreparationProps) {
    
    
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