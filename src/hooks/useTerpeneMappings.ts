import {useEffect, useState} from 'react';
import {getTerpeneObject, updateTerpeneObject} from '@/api/api';
import {
    BasicProperty,
    PropertywithCitation,
    Smell,
    SmellwithCitation,
    Taste,
    TastewithCitation,
    TerpeneObjectResponse
} from '@/interfaces';
import {SelectChangeEvent} from '@mui/material';

const useTerpeneMappings = (terpene: TerpeneObjectResponse, openSnackbar: (message: string) => void, onClose: () => void) => {
    const [selectedTastes, setSelectedTastes] = useState<TastewithCitation[]>(terpene.aryTaste);
    const [selectedSmells, setSelectedSmells] = useState<SmellwithCitation[]>(terpene.arySmell);
    const [selectedProperties, setSelectedProperties] = useState<PropertywithCitation[]>(terpene.aryProperty);

    const [initialTastes, setInitialTastes] = useState<TastewithCitation[]>(terpene.aryTaste);
    const [initialSmells, setInitialSmells] = useState<SmellwithCitation[]>(terpene.arySmell);
    const [initialProperties, setInitialProperties] = useState<PropertywithCitation[]>(terpene.aryProperty);

    useEffect(() => {
        setSelectedTastes(terpene.aryTaste || []);
        setSelectedSmells(terpene.arySmell || []);
        setSelectedProperties(terpene.aryProperty || []);

        setInitialTastes(terpene.aryTaste || []);
        setInitialSmells(terpene.arySmell || []);
        setInitialProperties(terpene.aryProperty || []);
    }, [terpene]);

    const handleDeleteTaste = (tasteToDelete: TastewithCitation) => {
        setSelectedTastes(prevTastes => prevTastes.filter(taste => taste !== tasteToDelete));
    };

    const handleDeleteSmell = (smellToDelete: SmellwithCitation) => {
        setSelectedSmells(prevSmells => prevSmells.filter(smell => smell !== smellToDelete));
    }

    const handleDeleteProperty = (propertyToDelete: PropertywithCitation) => {
        setSelectedProperties(prevProperties => prevProperties.filter(property => property !== propertyToDelete));
    }

    const handleTasteChange = (event: SelectChangeEvent<Taste[]>) => {
        setSelectedTastes(event.target.value as TastewithCitation[]);
    };

    const handleSmellChange = (event: SelectChangeEvent<Smell[]>) => {
        setSelectedSmells(event.target.value as SmellwithCitation[]);
    };

    const handlePropertyChange = (event: SelectChangeEvent<BasicProperty[]>) => {
        setSelectedProperties(event.target.value as PropertywithCitation[]);
    };

    const resetSelections = () => {
        setSelectedTastes(initialTastes);
        setSelectedSmells(initialSmells);
        setSelectedProperties(initialProperties);
    };

    const updateTerpeneMapping = async () => {
        // Fetch the latest terpene object from the server
        const latestTerpene = await getTerpeneObject(terpene.TerpeneID);

        let updatedTerpene = {...latestTerpene};

        updatedTerpene.arySmell = selectedSmells.map(selectedSmell => {
            const existingSmell = latestTerpene.arySmell
                ? latestTerpene.arySmell.find(smell => smell.SmellID === selectedSmell.SmellID)
                : null;
            return existingSmell ? existingSmell : {...selectedSmell, Citation: ''};
        });

        updatedTerpene.aryTaste = selectedTastes.map(selectedTaste => {
            const existingTaste = latestTerpene.aryTaste
                ? latestTerpene.aryTaste.find(taste => taste.TasteID === selectedTaste.TasteID)
                : null;
            return existingTaste ? existingTaste : {...selectedTaste, Citation: ''};
        });

        updatedTerpene.aryProperty = selectedProperties.map(selectedProperty => {
            const existingProperty = latestTerpene.aryProperty
                ? latestTerpene.aryProperty.find(property => property.PropertyID === selectedProperty.PropertyID)
                : null;
            return existingProperty ? existingProperty : {...selectedProperty, Citation: ''};
        });

        try {
            await updateTerpeneObject(updatedTerpene);
            openSnackbar('Changes have been saved');
            onClose();
        } catch (error) {
            console.error('Error updating terpene object:', error);
        }
    };

    return {
        selectedTastes,
        selectedSmells,
        selectedProperties,
        updateTerpeneMapping,
        handleDeleteTaste,
        handleDeleteSmell,
        handleDeleteProperty,
        handleTasteChange,
        handleSmellChange,
        handlePropertyChange,
        resetSelections
    };
};

export default useTerpeneMappings;