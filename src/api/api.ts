// api/api.ts
import {Property, Smell, Taste, Terpene, TerpeneObjectResponse} from '@/interfaces';

export const BASE_URL = 'https://dev.strainseekr.com/api-server';

export enum API_ENDPOINTS {
    GET_TERPENES = BASE_URL+'/V1_Terpene',
    GET_TERPENE_OBJECT = BASE_URL+'/V2_TerpeneObject',
    GET_SMELLS = BASE_URL+'/V1_Smell',
    GET_TASTES = BASE_URL+'/V1_Taste',
    GET_PROPERTIES = BASE_URL+'/V1_Property'
}




export const getTerpenes = async (dispensaryId: number): Promise<Terpene[]> => {
    const response = await fetch(`${API_ENDPOINTS.GET_TERPENES}?DispensaryID=${dispensaryId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch terpenes');
    }
    return await response.json();
};

export const getSmells = async (dispensaryId: number, strainTypeIds: string): Promise<Smell[]> => {
    const response = await fetch(`${API_ENDPOINTS.GET_SMELLS}?DispensaryID=${dispensaryId}&StrainTypeIDs=${strainTypeIds}`);
    if (!response.ok) {
        throw new Error('Failed to fetch smells');
    }
    return await response.json();
}

export const getTastes = async (dispensaryId: number, strainTypeIds: string): Promise<Taste[]> => {
    const response = await fetch(`${API_ENDPOINTS.GET_TASTES}?DispensaryID=${dispensaryId}&StrainTypeIDs=${strainTypeIds}`);
    if (!response.ok) {
        throw new Error('Failed to fetch tastes');
    }
    return await response.json();

}

export const getProperties = async (): Promise<Property[]> => {
    const response = await fetch(API_ENDPOINTS.GET_PROPERTIES);
    if (!response.ok) {
        throw new Error('Failed to fetch properties');
    }
    return await response.json();
}

export const getTerpeneObject = async (terpeneId: number): Promise<TerpeneObjectResponse> => {
    const response = await fetch(`${API_ENDPOINTS.GET_TERPENE_OBJECT}?inTerpeneID=${terpeneId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch terpenes');
    }
    return await response.json();
};


export const updateTerpeneObject = async (terpeneObject: TerpeneObjectResponse): Promise<void> => {
    const response = await fetch('https://dev.strainseekr.com/api-server/V2_TerpeneObjectUpdate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(terpeneObject)
    });

    if (!response.ok) {
        throw new Error('Failed to update terpene object');
    }
}
