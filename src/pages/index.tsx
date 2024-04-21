import React, {useEffect, useState} from 'react';
import {Box, Button, Grid, MenuItem, Paper, Select, SelectChangeEvent, Snackbar, Typography} from '@mui/material';
import {PropertywithCitation, SmellwithCitation, TastewithCitation, Terpene, TerpeneObjectResponse} from '@/interfaces';
import {getTerpeneObject, getTerpenes, updateTerpeneObject} from '@/api/api';
import SelectionModal from '@/components/SelectionModal';
import MuiAlert from '@mui/material/Alert';
import DeletionModal from '@/components/DeletionModal';
import CitationList from '@/components/CitationList';

const Index: React.FC = () => {
    const [terpenes, setTerpenes] = useState<Terpene[]>([]);
    const [selectedTerpene, setSelectedTerpene] = useState<TerpeneObjectResponse>({
        TerpeneID: 0,
        Terpene: '',
        arySmell: [],
        aryTaste: [],
        arySynonym: [],
        aryProperty: []
    });
    const [selectionModal, setOpenSelectionModal] = useState(false);
    const [deletionModal, setOpenDeletionModal] = useState(false);
    const [selectedTastes, setSelectedTastes] = useState<TastewithCitation[]>([]);
    const [selectedSmells, setSelectedSmells] = useState<SmellwithCitation[]>([]);
    const [selectedProperties, setSelectedProperties] = useState<PropertywithCitation[]>([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');


    useEffect(() => {
        const fetchAllTerpenes = async () => {
            try {
                const data = await getTerpenes(0);
                setTerpenes(data);
            } catch (error) {
                console.error('Error fetching terpenes:', error);
            }
        };

        fetchAllTerpenes().then(() => {
        });
    }, []);

    const openSnackbar = (message: string) => {
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
                arySynonym: [],
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

    const openSelectionModal = () => {
        setOpenSelectionModal(true);
    };
    const openDeletionModal = () => {
        setOpenDeletionModal(true);
    };


    const clearSelections = () => {
        setSelectedTastes([]);
        setSelectedSmells([]);
        setSelectedProperties([]);
    }

    const createHandleCitationChange = (type: 'smell' | 'taste' | 'property') => async (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, id: number) => {
        const newCitation = event.target.value;
        let updatedSmells = selectedSmells;
        let updatedTastes = selectedTastes;
        let updatedProperties = selectedProperties;

        if (type === 'smell') {
            updatedSmells = selectedSmells.map(smell => smell.SmellID === id ? {
                ...smell,
                Citation: newCitation
            } : smell);
            setSelectedSmells(updatedSmells);
        } else if (type === 'taste') {
            updatedTastes = selectedTastes.map(taste => taste.TasteID === id ? {
                ...taste,
                Citation: newCitation
            } : taste);
            setSelectedTastes(updatedTastes);
        } else if (type === 'property') {
            updatedProperties = selectedProperties.map(property => property.PropertyID === id ? {
                ...property,
                Citation: newCitation
            } : property);
            setSelectedProperties(updatedProperties);
        }

        const terpeneObject: TerpeneObjectResponse = {
            TerpeneID: selectedTerpene?.TerpeneID,
            Terpene: selectedTerpene?.Terpene,
            arySmell: updatedSmells,
            aryTaste: updatedTastes,
            arySynonym: selectedTerpene?.arySynonym,
            aryProperty: updatedProperties
        };

        await updateTerpeneObject(terpeneObject);
    };

    const handleSmellCitationChange = createHandleCitationChange('smell');
    const handleTasteCitationChange = createHandleCitationChange('taste');
    const handlePropertyCitationChange = createHandleCitationChange('property');


    return (
        <Box width="100%" display="flex" flexDirection="column" alignItems="center">
            <Typography variant="h4" mb={5}>Terpene Mapping</Typography>
            <Box width="50%" mb={2} display="flex" flexDirection="column" alignItems="center">
                <Select
                    value={selectedTerpene?.TerpeneID || ''}
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
                <Grid container spacing={2} justifyContent="center">
                    {selectedTerpene && (
                        <>
                            <Grid item xs={6} sx={{mt: 1}}>
                                <Button onClick={openSelectionModal} variant="outlined">Add Details</Button>
                                <Button onClick={openDeletionModal} variant="outlined" color="error" sx={{ml: 1}}>Remove
                                    Details</Button>
                            </Grid>
                        </>
                    )}
                </Grid>
            </Box>
            {selectedTerpene.TerpeneID !== 0 && (
                <Box mt={2} width="100%">
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                                <Typography variant="h6">Selected Smells:</Typography>
                                <CitationList
                                    items={(selectedSmells || []).map(smell => ({
                                        id: smell.SmellID,
                                        name: smell.Smell,
                                        citation: smell.Citation
                                    }))}
                                    type='Smell'
                                    handleCitationChange={handleSmellCitationChange}
                                    openSnackbar={openSnackbar}
                                />
                            </Paper>
                        </Grid>
                        <Grid item xs={4}>
                            <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                                <Typography variant="h6">Selected Tastes:</Typography>
                                <CitationList
                                    items={(selectedTastes || []).map(taste => ({
                                        id: taste.TasteID,
                                        name: taste.Taste,
                                        citation: taste.Citation
                                    }))}
                                    type='Taste'
                                    handleCitationChange={handleTasteCitationChange}
                                    openSnackbar={openSnackbar}
                                />
                            </Paper>
                        </Grid>
                        <Grid item xs={4}>
                            <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                                <Typography variant="h6">Selected Properties:</Typography>
                                <CitationList
                                    items={(selectedProperties || []).map(property => ({
                                        id: property.PropertyID,
                                        name: property.Property,
                                        citation: property.Citation
                                    }))}
                                    type='Property'
                                    handleCitationChange={handlePropertyCitationChange}
                                    openSnackbar={openSnackbar}
                                />
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            )}
            <SelectionModal
                terpene={selectedTerpene}
                open={selectionModal}
                onClose={() => {
                    setOpenSelectionModal(false);
                    fetchAndUpdateTerpeneObject(selectedTerpene?.TerpeneID).then(() => {
                    }); // Call fetchTerpeneObject after modal is closed
                }}
                onClearSelections={clearSelections}
                openSnackbar={openSnackbar}
            />
            <DeletionModal
                terpene={selectedTerpene}
                open={deletionModal}
                onClose={() => {
                    setOpenDeletionModal(false);
                    fetchAndUpdateTerpeneObject(selectedTerpene?.TerpeneID).then(() => {
                    }); // Call fetchTerpeneObject after modal is closed
                }}
                openSnackbar={openSnackbar}
            />
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <MuiAlert elevation={6} variant="filled" onClose={handleSnackbarClose} severity="success">
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </Box>

    );
};

export default Index;
