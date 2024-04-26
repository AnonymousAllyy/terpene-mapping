import {useEffect, useState} from 'react';
import {getProperties, getSmells, getTastes} from '@/api/api';
import {Property, Smell, Taste} from '@/interfaces';


const useFetchTerpeneData = (open: boolean) => {
    const [tastes, setTastes] = useState<Taste[]>([]);
    const [smells, setSmells] = useState<Smell[]>([]);
    const [properties, setProperties] = useState<Property[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tastesData = await getTastes(0, '');
                setTastes(tastesData);
                const smellsData = await getSmells(0, '');
                setSmells(smellsData);
                const propertiesData = await getProperties();
                setProperties(propertiesData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (open) {
            fetchData().then(() => {
            });
        }
    }, [open]);

    return {tastes, smells, properties};
};

export default useFetchTerpeneData;