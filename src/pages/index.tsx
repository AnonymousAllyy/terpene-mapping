import React, {useEffect, useState} from 'react';
import {Box, Button, Grid, SelectChangeEvent, Snackbar, Typography} from '@mui/material';
import {PropertywithCitation, SmellwithCitation, TastewithCitation, Terpene, TerpeneObjectResponse} from '@/interfaces';
import {getTerpeneObject, getTerpenes, updateTerpeneObject} from '@/api/api';
import MuiAlert from '@mui/material/Alert';
import EditTerpeneDetailsModal from '@/components/EditTerpeneDetailsModal';
import {ThemeProvider} from '@mui/material/styles';
import theme from '../styles/theme';
import Navbar from '@/components/Navbar';
import TerpeneSelect from '@/components/TerpeneSelect';
import SelectedItems from '@/components/SelectedItems';
import colors from '../styles/colors';

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

    const [terpeneDetailsModal, setTerpeneDetailsModal] = useState(false);
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

    const closeSnackbar = () => {
        setSnackbarOpen(false);
    };

    const openTerpeneDetailsModal = () => {
        setTerpeneDetailsModal(true);
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
        <ThemeProvider theme={theme}>
            <Navbar/>
            <Box width="100%" display="flex" flexDirection="column" alignItems="center"
                 sx={{backgroundColor: theme.palette.background.default, minHeight: '100vh'}}>

                <Box width="30%" mb={2} display="flex" flexDirection="column">
                    <Typography variant="h6" mt={5}>Select Terpene:</Typography>
                    <TerpeneSelect terpenes={terpenes} selectedTerpeneId={selectedTerpene?.TerpeneID} handleTerpeneChange={handleTerpeneChange} />
                    {selectedTerpene.TerpeneID !== 0 && (
                        <>
                            <Grid item xs={12} sx={{mt: 1}}>
                                <Button onClick={openTerpeneDetailsModal} variant="contained"
                                        sx={{ml: 1, backgroundColor: colors.secondary}}>Add or Remove
                                    Details</Button>
                            </Grid>
                        </>
                    )}
            </Box>
            {selectedTerpene.TerpeneID !== 0 && (
                <Box mt={2} width="75%" sx={{backgroundColor: colors.background}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={12}>
                            <SelectedItems
                                items={(selectedSmells || []).map(smell => ({
                                    id: smell.SmellID,
                                    name: smell.Smell,
                                    citation: smell.Citation
                                }))}
                                type='Smell'
                                handleCitationChange={handleSmellCitationChange}
                                openSnackbar={openSnackbar}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}>
                                <SelectedItems
                                    items={(selectedTastes || []).map(taste => ({
                                        id: taste.TasteID,
                                        name: taste.Taste,
                                        citation: taste.Citation
                                    }))}
                                    type='Taste'
                                    handleCitationChange={handleTasteCitationChange}
                                    openSnackbar={openSnackbar}
                                />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}>
                                <SelectedItems
                                    items={(selectedProperties || []).map(property => ({
                                        id: property.PropertyID,
                                        name: property.Property,
                                        citation: property.Citation
                                    }))}
                                    type='Property'
                                    handleCitationChange={handlePropertyCitationChange}
                                    openSnackbar={openSnackbar}
                                />
                        </Grid>
                    </Grid>
                </Box>
            )}
            <EditTerpeneDetailsModal
                terpene={selectedTerpene}
                open={terpeneDetailsModal}
                onClose={() => {
                    setTerpeneDetailsModal(false);
                    fetchAndUpdateTerpeneObject(selectedTerpene.TerpeneID).then(() => {
                    }); // Call fetchTerpeneObject after modal is closed
                }}
                openSnackbar={openSnackbar}
            />
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={closeSnackbar}>
                <MuiAlert elevation={6} variant="filled" onClose={closeSnackbar} severity="success">
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </Box>
        </ThemeProvider>
    );
};

export default Index;
