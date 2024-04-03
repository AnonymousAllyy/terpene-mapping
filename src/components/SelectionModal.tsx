import React, { useState, useEffect } from 'react';
import { Modal, Typography, Button, Box, MenuItem, Select, SelectChangeEvent, Chip } from '@mui/material';
import { getTastes, getSmells, getProperties, updateTerpeneObject } from '@/api/api';
import {
    Terpene,
    Property,
    PropertywithCitation,
    Smell,
    SmellwithCitation,
    Taste,
    TastewithCitation,
    TerpeneObjectResponse
} from '@/interfaces';
import CancelIcon from '@mui/icons-material/Cancel';

interface Props {
    terpene: TerpeneObjectResponse;
    open: boolean;
    onClose: () => void;
    onClearSelections: () => void;
}

const SelectionModal: React.FC<Props> = ({ terpene, open, onClose, onClearSelections, handleSnackbarOpen }) => {
    const [tastes, setTastes] = useState<Taste[]>([]);
    const [smells, setSmells] = useState<Smell[]>([]);
    const [properties, setProperties] = useState<Property[]>([]);
    const [selectedTastes, setSelectedTastes] = useState<Taste[]>([]);
    const [selectedSmells, setSelectedSmells] = useState<Smell[]>([]);
    const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tastesData = await getTastes(0, '');
                setTastes(tastesData);
                const smellsData = await getSmells(0, ''); // Assuming dispensary ID is 0 and no specific strain type IDs
                setSmells(smellsData);
                const propertiesData = await getProperties();
                setProperties(propertiesData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [open]); // Fetch data whenever the modal opens

    useEffect(() => {
        if (!open) {
            // Reset selected tastes, smells, and properties when modal is closed
            setSelectedTastes([]);
            setSelectedSmells([]);
            setSelectedProperties([]);
        }
    }, [open]);

    const handleSave = async () => {
        let allTastes = [];
        let allSmells = [];
        let allProperties = [];

        if (terpene.aryTaste) {
            allTastes = [...terpene.aryTaste, ...selectedTastes].map(taste => ({ ...taste, Citation: '' }));
        } else {
            allTastes = [...selectedTastes].map(taste => ({ ...taste, Citation: '' }));
        }

        if (terpene.arySmell) {
            allSmells = [...terpene.arySmell, ...selectedSmells].map(smell => ({ ...smell, Citation: '' }));
        } else {
            allSmells = [...selectedSmells].map(smell => ({ ...smell, Citation: '' }));
        }

        if (terpene.aryProperty) {
            allProperties = [...terpene.aryProperty, ...selectedProperties].map(property => ({ ...property, Citation: '' }));
        } else {
            allProperties = [...selectedProperties].map(property => ({ ...property, Citation: '' }));
        }

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
            onClose(); // Close the modal after successful update
            handleSnackbarOpen('Changes have been saved');
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

    const handleDeleteProperty = (propertyToDelete: Property) => {
        setSelectedProperties(prevProperties => prevProperties.filter(property => property !== propertyToDelete));
    }

    const handleTasteChange = (event: SelectChangeEvent<Taste[]>) => {
        setSelectedTastes(event.target.value as Taste[]);
    };

    const handleSmellChange = (event: SelectChangeEvent<Smell[]>) => {
        setSelectedSmells(event.target.value as Smell[]);
    };

    const handlePropertyChange = (event: SelectChangeEvent<Property[]>) => {
        setSelectedProperties(event.target.value as Property[]);
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
                        <MenuItem key={smell.SmellID} value={smell}>
                            {smell.Smell}
                        </MenuItem>
                    ))}
                </Select>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', marginTop: '8px' }}>
                    {selectedSmells.map((smell) => (
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
                        <MenuItem key={taste.TasteID} value={taste}>
                            {taste.Taste}
                        </MenuItem>
                    ))}
                </Select>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', marginTop: '8px' }}>
                    {selectedTastes.map((taste) => (
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
                    value={selectedProperties}
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
                        <MenuItem key={property.PropertyID} value={property}>
                            {property.Property}
                        </MenuItem>
                    ))}
                </Select>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', marginTop: '8px' }}>
                    {selectedProperties.map((property) => (
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
                </Button>;
            </Box>
        </Modal>
    );
};

export default SelectionModal;