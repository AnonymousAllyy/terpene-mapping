import React, {useEffect, useState} from 'react';
import {Box, Button, Chip, MenuItem, Modal, Select, SelectChangeEvent, Typography} from '@mui/material';
import {updateTerpeneObject} from '@/api/api';
import {BasicProperty, Property, Smell, Taste, TerpeneObjectResponse} from '@/interfaces';
import CancelIcon from '@mui/icons-material/Cancel';
import useFetchTerpeneData from '@/hooks/useFetchTerpeneData';

interface Props {
    terpene: TerpeneObjectResponse;
    open: boolean;
    onClose: () => void;
    onClearSelections: () => void;
    openSnackbar: (message: string) => void;
}


const SelectionModal: React.FC<Props> = ({terpene, open, onClose, onClearSelections, openSnackbar}) => {
    const {tastes, smells, properties} = useFetchTerpeneData(open);
    const [selectedTastes, setSelectedTastes] = useState<Taste[]>([]);
    const [selectedSmells, setSelectedSmells] = useState<Smell[]>([]);
    const [selectedProperties, setSelectedProperties] = useState<BasicProperty[]>([]);


    useEffect(() => {
        if (!open) {
            // Reset selected tastes, smells, and properties when modal is closed
            setSelectedTastes([]);
            setSelectedSmells([]);
            setSelectedProperties([]);
        }
    }, [open]);

    const handleSave = async () => {
        let allTastes: any[];
        let allSmells: any[];
        let allProperties: any[];

        // Filter out duplicate tastes
        const newSelectedTastes = selectedTastes.filter(taste => !terpene?.aryTaste || !terpene?.aryTaste.find(t => t.TasteID === taste.TasteID));
        allTastes = terpene?.aryTaste ? [...terpene.aryTaste, ...newSelectedTastes] : [...newSelectedTastes];
        allTastes = allTastes.map(taste => {
            const existingTaste = terpene?.aryTaste?.find(t => t.TasteID === taste.TasteID);
            return existingTaste ? existingTaste : {...taste, Citation: ''};
        });

        // Filter out duplicate smells
        const newSelectedSmells = selectedSmells.filter(smell => !terpene?.arySmell || !terpene?.arySmell.find(s => s.SmellID === smell.SmellID));
        allSmells = terpene?.arySmell ? [...terpene?.arySmell, ...newSelectedSmells] : [...newSelectedSmells];
        allSmells = allSmells.map(smell => {
            const existingSmell = terpene?.arySmell?.find(s => s.SmellID === smell.SmellID);
            return existingSmell ? existingSmell : {...smell, Citation: ''};
        });

        // Filter out duplicate properties
        const newSelectedProperties = selectedProperties.filter(property => !terpene?.aryProperty || !terpene?.aryProperty.find(p => p.PropertyID === property.PropertyID));
        allProperties = terpene?.aryProperty ? [...terpene?.aryProperty, ...newSelectedProperties] : [...newSelectedProperties];
        allProperties = allProperties.map(property => {
            const existingProperty = terpene?.aryProperty?.find(p => p.PropertyID === property.PropertyID);
            return existingProperty ? existingProperty : {...property, Citation: ''};
        });

        const terpeneObject: TerpeneObjectResponse = {
            TerpeneID: terpene.TerpeneID,
            Terpene: terpene.Terpene,
            arySmell: allSmells,
            aryTaste: allTastes,
            arySynonym: terpene.arySynonym,
            aryProperty: allProperties
        };

        try {
            await updateTerpeneObject(terpeneObject);
            openSnackbar('Changes have been saved');
            onClose(); // Close the modal after successful update
        } catch (error) {
            console.error('Error updating terpene object:', error);
        }
    };

    const handleDeleteTaste = (tasteToDelete: Taste) => {
        setSelectedTastes(prevTastes => prevTastes.filter(taste => taste !== tasteToDelete));
    };

    const handleDeleteSmell = (smellToDelete: Smell) => {
        setSelectedSmells(prevSmells => prevSmells.filter(smell => smell !== smellToDelete));
    }

    const handleDeleteProperty = (propertyToDelete: BasicProperty) => {
        setSelectedProperties(prevProperties => prevProperties.filter(property => property.PropertyID !== propertyToDelete.PropertyID));
    }

    const handleTasteChange = (event: SelectChangeEvent<Taste[]>) => {
        setSelectedTastes(event.target.value as Taste[]);
        console.log(selectedTastes);
    };

    const handleSmellChange = (event: SelectChangeEvent<Smell[]>) => {
        setSelectedSmells(event.target.value as Smell[]);
    };

    const handlePropertyChange = (event: SelectChangeEvent<Property[]>) => {
        const selectedProperties = event.target.value as Property[];
        console.log(selectedProperties);
        const newSelectedProperty = selectedProperties.map(property => ({
            PropertyID: property.PropertyID,
            Property: property.Property
        }));
        console.log(newSelectedProperty);
        setSelectedProperties(newSelectedProperty);
    };

    const clearSelections = () => {
        setSelectedTastes([]);
        setSelectedSmells([]);
        setSelectedProperties([]);
    };
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                <Typography variant="h6">Select Smells:</Typography>
                <Select
                    multiple
                    value={selectedSmells}
                    onChange={handleSmellChange}
                    sx={{ width: '100%' }}
                    MenuProps={{
                        PaperProps: {
                            style: {
                                maxHeight: 300,
                            },
                        },
                    }}
                >
                    {smells.map((smell) => (
                        <MenuItem key={smell.SmellID} value={smell as any}>
                            {smell.Smell}
                        </MenuItem>
                    ))}
                </Select>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', marginTop: '8px' }}>
                    {selectedSmells && selectedSmells.map((smell) => (
                        <Chip
                            key={smell.SmellID}
                            label={smell.Smell}
                            onDelete={() => handleDeleteSmell(smell)}
                            deleteIcon={<CancelIcon />}
                            style={{ marginRight: '8px', marginBottom: '8px' }}
                        />
                    ))}
                </Box>
                <Typography variant="h6">Select Tastes:</Typography>
                <Select
                    multiple
                    value={selectedTastes}
                    onChange={handleTasteChange}
                    sx={{ width: '100%' }}
                    MenuProps={{
                        PaperProps: {
                            style: {
                                maxHeight: 300, // Adjust the maxHeight as needed
                            },
                        },
                    }}
                >
                    {tastes.map((taste) => (
                        <MenuItem key={taste.TasteID} value={taste as any}>
                            {taste.Taste}
                        </MenuItem>
                    ))}
                </Select>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', marginTop: '8px' }}>
                    {selectedTastes && selectedTastes.map((taste) => (
                        <Chip
                            key={taste.TasteID}
                            label={taste.Taste}
                            onDelete={() => handleDeleteTaste(taste)}
                            deleteIcon={<CancelIcon />}
                            style={{ marginRight: '8px', marginBottom: '8px' }}
                        />
                    ))}
                </Box>
                <Typography variant="h6">Select Properties:</Typography>
                <Select
                    multiple
                    value={properties.filter(property => selectedProperties.some(selectedProperty => selectedProperty.PropertyID === property.PropertyID))}
                    onChange={handlePropertyChange}
                    sx={{ width: '100%' }}
                    MenuProps={{
                        PaperProps: {
                            style: {
                                maxHeight: 200, // Adjust the maxHeight as needed
                            },
                        },
                    }}
                >
                    {properties.map((property) => (
                        <MenuItem key={property.PropertyID} value={property as any}>
                            {property.Property}
                        </MenuItem>
                    ))}
                </Select>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', marginTop: '8px' }}>
                    {selectedProperties && selectedProperties.map((property) => (
                        <Chip
                            key={property.PropertyID}
                            label={property.Property}
                            onDelete={() => handleDeleteProperty(property)}
                            deleteIcon={<CancelIcon />}
                            style={{ marginRight: '8px', marginBottom: '8px' }}
                        />
                    ))}
                </Box>
                <Button onClick={handleSave} variant="contained">Save</Button>
                <Button onClick={() => {
                    clearSelections();
                    onClearSelections();
                }} variant="contained" color="error" sx={{ ml: 1 }}>
                    Clear
                </Button>
            </Box>
        </Modal>
    );
};

export default SelectionModal;