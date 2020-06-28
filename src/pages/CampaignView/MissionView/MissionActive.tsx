import React from 'react';
import Card from 'react-bootstrap/Card';
import { LinkContainer } from 'react-router-bootstrap';

import Mission from "../../../../object_defs/Campaign/Mission/Mission";
import { EventData } from "../../../../object_defs/Campaign/Mission/EventData";

export type MissionActiveProps = {
    mission: Mission
};

export default function MissionActive ({ mission } : MissionActiveProps) {
    return (<>
        <div>
            {mission.events.slice(0).reverse().map((event, i) => {
                return <Card key={i}>
                    <LinkContainer 
                        to={`/game/${mission.campaignId}/mission/${mission.id}/battle/${event.battleId}`}
                    >
                        <Card.Body>
                            <Card.Title>{i} - {EventData[event.eventType].name}</Card.Title>
                            <Card.Text>Click to join!</Card.Text>
                        </Card.Body>
                    </LinkContainer>
                </Card>;
            })}
        </div>
        { JSON.stringify(mission.toJSONObject) }
    </>);
}