import { NetworkableJSONObject, NetworkableObject } from "./NetworkableObject";

declare class _ObjectDefSkeletonInterface {
    readonly id: number;
    readonly campaignId: number;
    readonly missionId: number;
}

export interface _ObjectDefSkeletonJSONObject extends _ObjectDefSkeletonInterface, NetworkableJSONObject {}

declare class _ObjectDefSkeleton extends _ObjectDefSkeletonInterface implements NetworkableObject {
    constructor(id: number, campaignId: number, missionId: number);
    toJSONObject(): _ObjectDefSkeletonJSONObject;
    public static fromJSONObject(jsonObject: _ObjectDefSkeletonJSONObject): _ObjectDefSkeleton;
}

export default _ObjectDefSkeleton;
