export declare type MissionEvent = {
    eventType: number,
    choice: number,
    battleId: number,
}

interface EventDataType {
    name: string,
}

interface EventDataInterface {
    [key: number]: EventDataType,
}

declare const EventData: EventDataInterface