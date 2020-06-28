import { useState } from 'react';
import { makeAPICall } from '../app/helpers';
import { NetworkableJSONObject, NetworkableObject } from '../../object_defs/NetworkableObject';
import Mission from '../../object_defs/Campaign/Mission/Mission';

interface IAPICaller<T extends NetworkableObject> {
    isLoading: boolean;
    error: {
        code: number;
        message: string;
    } | undefined;
    networkObject: T;
}

type NetworkAPIResponse = {
    data: NetworkableJSONObject,
};

type MakeCallFunctionType = (
    data: object,
) => Promise<void>;

type SetNetworkObjectFunctionType<T extends NetworkableObject> = (
    networkObject: T,
) => void;

type NetworkObjectTransformerFunc<T extends NetworkableObject> = (responseData: NetworkableJSONObject) => T;

type CreateAPICallableType<T extends NetworkableObject> = {
    apiCallableState: IAPICaller<T>,
    makeCall: MakeCallFunctionType,
    setNetworkObject: SetNetworkObjectFunctionType<T>,
};

export function CreateAPICallableState<T extends NetworkableObject>(
    uri: string, // The URI to call to fetch the data
    networkObjectTransformer: NetworkObjectTransformerFunc<T>
): CreateAPICallableType<T> {
    const [ apiCallableState, setAPICallableState ] = 
        useState<IAPICaller<T>>({
            isLoading: true,
            error: undefined,
            networkObject: undefined
        });

    // networkObjectTransformer should be one of NetworkObjectType.fromJSONObject
    let makeCall: MakeCallFunctionType = (data) => {
        return makeAPICall(uri, data)
            .then((response: NetworkAPIResponse) => {
                // networkableObjectType.fromJSONObject(response.data)
                const networkObject: T = networkObjectTransformer(response.data);
                setAPICallableState({ 
                    isLoading: false,
                    error: undefined,
                    networkObject 
                });
            });
    }

    let setNetworkObject: SetNetworkObjectFunctionType<T> = (networkObject: T): void => {
        setAPICallableState({
            isLoading: apiCallableState.isLoading,
            error: apiCallableState.error,
            networkObject
        });
    }

    return { apiCallableState, makeCall, setNetworkObject }
}

// Intended to be used like this;
/*
    const { apiCallableState: missionData, makeCall } = CreateAPICallableState<Mission>(
        '/api/missions',
        Mission.fromJSONObject
    );
    useEffect(() => { makeCall({ campaignId, missionId }) }, []);
*/