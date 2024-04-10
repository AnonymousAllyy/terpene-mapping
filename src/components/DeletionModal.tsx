import {Box, Button, Chip, MenuItem, Modal, Select, SelectChangeEvent, Typography} from '@mui/material';
import {updateTerpeneObject} from '@/api/api';
import React, {useEffect, useState} from 'react';
import {
    BasicProperty,
    PropertywithCitation,
    Smell,
    SmellwithCitation,
    Taste,
    TastewithCitation,
    TerpeneObjectResponse
} from '@/interfaces';
import CancelIcon from '@mui/icons-material/Cancel';
import useFetchTerpeneData from '@/hooks/useFetchTerpeneData';

interface DeletionProps {
    terpene: TerpeneObjectResponse;
    open: boolean;
    onClose: () => void;
    handleSnackbarOpen: (message: string) => void;
}

const DeletionModal: React.FC<DeletionProps> = ({terpene, open, onClose, handleSnackbarOpen}) => {
    const {tastes, smells, properties} = useFetchTerpeneData(open);
    const [selectedTastes, setSelectedTastes] = useState<TastewithCitation[]>(terpene.aryTaste);
    const [selectedSmells, setSelectedSmells] = useState<SmellwithCitation[]>(terpene.arySmell);
    const [selectedProperties, setSelectedProperties] = useState<PropertywithCitation[]>(terpene.aryProperty);
    const [initialTastes, setInitialTastes] = useState<TastewithCitation[]>([]);
    const [initialSmells, setInitialSmells] = useState<SmellwithCitation[]>([]);
    const [initialProperties, setInitialProperties] = useState<PropertywithCitation[]>([]);


    useEffect(() => {
        setSelectedTastes(terpene.aryTaste || []);
        setSelectedSmells(terpene.arySmell || []);
        setSelectedProperties(terpene.aryProperty || []);

        setInitialTastes(terpene.aryTaste || []);
        setInitialSmells(terpene.arySmell || []);
        setInitialProperties(terpene.aryProperty || []);
    }, [terpene]);


    const handleDelete = async () => {
        let updatedTerpene = {...terpene};

        updatedTerpene.arySmell = selectedSmells;
        updatedTerpene.aryTaste = selectedTastes;
        updatedTerpene.aryProperty = selectedProperties;

        try {
            await updateTerpeneObject(updatedTerpene);
            handleSnackbarOpen('Changes have been saved');
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
        // Reset the selections to the initial state
        setSelectedTastes(initialTastes);
        setSelectedSmells(initialSmells);
        setSelectedProperties(initialProperties);
    };

    // @ts-ignore
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4
            }}>
                <Typography variant="h6">Delete Smells:</Typography>
                <Select
                    multiple
                    value={smells.filter(smell => selectedSmells.some(selectedSmell => selectedSmell.SmellID === smell.SmellID))}
                    onChange={handleSmellChange}
                    sx={{width: '100%'}}
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
                <Box sx={{display: 'flex', flexWrap: 'wrap', marginTop: '8px'}}>
                    {selectedSmells.map((smell) => (
                        <Chip
                            key={smell.SmellID}
                            label={smell.Smell}
                            onDelete={() => handleDeleteSmell(smell)}
                            deleteIcon={<CancelIcon/>}
                            style={{marginRight: '8px', marginBottom: '8px'}}
                        />
                    ))}
                </Box>
                <Typography variant="h6">Delete Tastes:</Typography>
                <Select
                    multiple
                    value={tastes.filter(taste => selectedTastes.some(selectedTaste => selectedTaste.TasteID === taste.TasteID))}
                    onChange={handleTasteChange}
                    sx={{width: '100%'}}
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
                <Box sx={{display: 'flex', flexWrap: 'wrap', marginTop: '8px'}}>
                    {selectedTastes.map((taste) => (
                        <Chip
                            key={taste.TasteID}
                            label={taste.Taste}
                            onDelete={() => handleDeleteTaste(taste)}
                            deleteIcon={<CancelIcon/>}
                            style={{marginRight: '8px', marginBottom: '8px'}}
                        />
                    ))}
                </Box>
                <Typography variant="h6">Delete Properties:</Typography>
                <Select
                    multiple
                    value={properties.filter(property => selectedProperties.some(selectedProperty => selectedProperty.PropertyID === property.PropertyID))}
                    onChange={handlePropertyChange}
                    sx={{width: '100%'}}
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
                <Box sx={{display: 'flex', flexWrap: 'wrap', marginTop: '8px'}}>
                    {selectedProperties.map((property) => (
                        <Chip
                            key={property.PropertyID}
                            label={property.Property}
                            onDelete={() => handleDeleteProperty(property)}
                            deleteIcon={<CancelIcon/>}
                            style={{marginRight: '8px', marginBottom: '8px'}}
                        />
                    ))}
                </Box>
                <Button onClick={handleDelete} variant="contained">Save</Button>
                <Button onClick={resetSelections} variant="contained" color="error" sx={{ml: 1}}>
                    Reset
                </Button>
            </Box>
        </Modal>
    );
};

export default DeletionModal;