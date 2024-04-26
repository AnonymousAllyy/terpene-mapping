import {Box, Button, Chip, MenuItem, Modal, Select, Typography} from '@mui/material';
import React from 'react';
import {TerpeneObjectResponse} from '@/interfaces';
import CancelIcon from '@mui/icons-material/Cancel';
import useFetchTerpeneData from '@/hooks/useFetchTerpeneData';
import useTerpeneMappings from '@/hooks/useTerpeneMappings';

interface UpdateTerpeneMappingsProps {
    terpene: TerpeneObjectResponse;
    open: boolean;
    onClose: () => void;
    openSnackbar: (message: string) => void;
}

const UpdateTerpeneMappingsModal: React.FC<UpdateTerpeneMappingsProps> = ({terpene, open, onClose, openSnackbar}) => {
    const {tastes, smells, properties} = useFetchTerpeneData(open);
    const {
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
    } = useTerpeneMappings(terpene, openSnackbar, onClose);


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
                <Typography variant="h6" sx={{mt: 2}}>Selected Smells:</Typography>
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
                <Typography variant="h6" sx={{mt: 2}}>Selected Tastes:</Typography>
                <Select
                    multiple
                    value={tastes.filter(taste => selectedTastes.some(selectedTaste => selectedTaste.TasteID === taste.TasteID))}
                    onChange={handleTasteChange}
                    sx={{width: '100%'}}
                    MenuProps={{
                        PaperProps: {
                            style: {
                                maxHeight: 300,
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
                <Typography variant="h6" sx={{mt: 2}}> Selected Properties:</Typography>
                <Select
                    multiple
                    value={properties.filter(property => selectedProperties.some(selectedProperty => selectedProperty.PropertyID === property.PropertyID))}
                    onChange={handlePropertyChange}
                    sx={{width: '100%'}}
                    MenuProps={{
                        PaperProps: {
                            style: {
                                maxHeight: 200,
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
                <Box sx={{display: 'flex', flexWrap: 'wrap', mt: 1, mb: 2}}>
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
                <Button onClick={updateTerpeneMapping} variant="contained" color="primary">Save</Button>
                <Button onClick={resetSelections} variant="contained" color="error" sx={{ml: 1}}>
                    Reset
                </Button>
            </Box>
        </Modal>
    );
};

export default UpdateTerpeneMappingsModal;