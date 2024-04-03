import React, { useState, useEffect } from 'react';
import {
    Select,
    MenuItem,
    Box,
    Typography,
    Grid,
    Button,
    Modal,
    Checkbox,
    ListItemText,
    InputLabel, SelectChangeEvent, Paper, Snackbar
} from '@mui/material';
import {
    Terpene,
    TerpeneObjectResponse,
    Taste,
    Property, Smell, PropertywithCitation, SmellwithCitation, TastewithCitation
} from '@/interfaces';
import {getTerpenes, getTerpeneObject} from '@/api/api';
import {FormControl} from '@mui/base';
import SelectionModal from '@/components/SelectionModal';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

interface PropertyObject {
    Property: string;
    PropertyID: number;
}

const Page: React.FC = () => {
    const [terpenes, setTerpenes] = useState<Terpene[]>([]);
    const [selectedTerpene, setSelectedTerpene] = useState<TerpeneObjectResponse>({
        TerpeneID: 0,
        Terpene: '',
        arySmell: [],
        aryTaste: [],
        arySynonym: null,
        aryProperty: []
    });
    const [openSelectionModal, setOpenSelectionModal] = useState(false);
    const [selectedTastes, setSelectedTastes] = useState<TastewithCitation[]>([]);
    const [selectedSmells, setSelectedSmells] = useState<SmellwithCitation[]>([]);
    const [selectedProperties, setSelectedProperties] = useState<PropertywithCitation[]>([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        const fetchAllTerpenes = async () => {
            try {
                const data = await getTerpenes(0); // Assuming dispensary ID is 0
                setTerpenes(data);
            } catch (error) {
                console.error('Error fetching terpenes:', error);
            }
        };

        fetchAllTerpenes().then(r => {});
    }, []);

    const handleSnackbarOpen = (message: string) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleTerpeneChange = async (event: SelectChangeEvent<number>) => {
        const terpeneID = event.target.value as number;
        const selectedTerpene = terpenes.find(terpene => terpene.TerpeneID === terpeneID);
        if (selectedTerpene) {
            await fetchAndUpdateTerpeneObject(selectedTerpene.TerpeneID);
        } else {
            setSelectedTerpene({
                TerpeneID: 0,
                Terpene: '',
                arySmell: [],
                aryTaste: [],
                arySynonym: null,
                aryProperty: []
            });
            setSelectedSmells([]);
            setSelectedTastes([]);
            setSelectedProperties([]);
        }
    };

    const fetchAndUpdateTerpeneObject = async (terpeneID: number) => {
        try {
            const data = await getTerpeneObject(terpeneID);
            if (data) {
                setSelectedTerpene(data);
                setSelectedSmells(data.arySmell);
                setSelectedTastes(data.aryTaste);
                setSelectedProperties(data.aryProperty);
            } else {
                console.error('Unexpected data format:', data);
            }
        } catch (error) {
            console.error('Error fetching terpene object:', error);
        }
    };

    const handleAddSelectionClick = () => {
        setOpenSelectionModal(true);
    };

    const handleSelectionModalClose = () => {
        setOpenSelectionModal(false);
    };

    const clearSelections = () => {
        setSelectedTastes([]);
        setSelectedSmells([]);
        setSelectedProperties([]);
    }

    const handleCitationClick = () => {
        console.log('Citation Clicked');
    }

    return (
        <Box width="100%" display="flex" flexDirection="column" alignItems="center">
            <Typography variant="h4" mb={5}>Terpene Mapping</Typography>
            <Box width="50%" mb={2} display="flex" flexDirection="column" alignItems="center">
                <Select
                    value={selectedTerpene?.TerpeneID}
                    onChange={handleTerpeneChange}
                    sx={{ width: '100%' }}
                    MenuProps={{
                        PaperProps: {
                            style: {
                                maxHeight: 300,
                            },
                        },
                    }}
                >
                    {terpenes.map((terpene) => (
                        <MenuItem key={terpene.TerpeneID} value={terpene.TerpeneID}>
                            {terpene.Terpene}
                        </MenuItem>
                    ))}
                </Select>
                <Box mt={2} display="flex" justifyContent="center">
                    {selectedTerpene?.Terpene && (
                        <>
                            <Button onClick={handleAddSelectionClick} variant="outlined">Add Details</Button>
                            <Button onClick={handleAddSelectionClick} variant="outlined" color="error" sx={{ ml: 1 }}>Remove Details</Button>
                            <Button onClick={handleCitationClick} variant="outlined" color="secondary" sx={{ ml: 1 }}>Add Citations</Button>
                        </>
                    )}
                </Box>
            </Box>
            {selectedTerpene?.TerpeneID !== 0 && (
                <Box mt={2} width="100%">
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                                <Typography variant="h6">Selected Smells:</Typography>
                                {selectedTerpene.arySmell ? (
                                    selectedTerpene.arySmell.map((smell: Smell) => (
                                        <Typography key={smell.SmellID}>{smell.Smell}</Typography>
                                    ))
                                ) : (
                                    <Typography>No smells available</Typography>
                                )}
                            </Paper>
                        </Grid>
                        <Grid item xs={4}>
                            <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                                <Typography variant="h6">Selected Tastes:</Typography>
                                {selectedTerpene.aryTaste ? (
                                    selectedTerpene.aryTaste.map((taste: Taste) => (
                                        <Typography key={taste.TasteID}>{taste.Taste}</Typography>
                                    ))
                                ) : (
                                    <Typography>No tastes available</Typography>
                                )}
                            </Paper>
                        </Grid>
                        <Grid item xs={4}>
                            <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                                <Typography variant="h6">Selected Properties:</Typography>
                                {selectedTerpene.aryProperty ? (
                                    selectedTerpene.aryProperty.map((property: PropertywithCitation) => (
                                        <Typography key={property.PropertyID}>{property.Property}</Typography>
                                    ))
                                ) : (
                                    <Typography>No properties available</Typography>
                                )}
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            )}
            <SelectionModal
                terpene={selectedTerpene}
                open={openSelectionModal}
                onClose={() => {
                    handleSelectionModalClose();
                    fetchAndUpdateTerpeneObject(selectedTerpene.TerpeneID); // Call fetchTerpeneObject after modal is closed
                }}
                onClearSelections={clearSelections}
                handleSnackbarOpen={handleSnackbarOpen}
            />
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <MuiAlert elevation={6} variant="filled" onClose={handleSnackbarClose} severity="success">
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </Box>

    );
};

export default Page;
