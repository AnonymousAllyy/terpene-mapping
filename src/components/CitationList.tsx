import {Box, Button, FormControlLabel, TextField, Typography} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import Collapse from '@mui/material/Collapse';
import React from 'react';
import CustomSwitch from '../styles/CustomSwitch';
import {Item} from '@/interfaces';
import colors from '../styles/colors';

interface CitationListProps {
    items: Item[];
    type: 'Smell' | 'Taste' | 'Property';
    handleCitationChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, id: number) => void;
    openSnackbar: (message: string) => void;
}


const CitationList: React.FC<CitationListProps> = ({items, type, handleCitationChange, openSnackbar}) => {
    const [tempCitations, setTempCitations] = React.useState<{ [id: number]: string[] }>({});
    const [showCitationInputId, setShowCitationInputId] = React.useState<number | null>(null);

    const showCitationInput = (item: Item) => {
        if (showCitationInputId === item.id) {
            setShowCitationInputId(null); // Close the text area
        } else {
            setShowCitationInputId(item.id); // Open the text area
            setTempCitations({
                ...tempCitations,
                [item.id]: [item.citation || '']
            });
        }
    };

    const handleTempCitationChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, id: number, index: number) => {
        setTempCitations({
            ...tempCitations,
            [id]: tempCitations[id].map((citation, i) => i === index ? event.target.value : citation)
        });
    };

    const saveCitation = (id: number, name: string, index: number) => {
        const currentCitation = items.find(item => item.id === id)?.citation || '';
        const newCitation = tempCitations[id][index];
        if (newCitation === currentCitation) {
            return;
        }

        handleCitationChange({target: {value: newCitation}} as React.ChangeEvent<HTMLInputElement>, id);
        setTempCitations({
            ...tempCitations,
            [id]: tempCitations[id].map((citation, i) => i === index ? newCitation : citation)
        });
        openSnackbar(`Citation for ${type}: ${name} has been updated`);
    };

    const addCitation = (id: number) => {
        setTempCitations({
            ...tempCitations,
            [id]: [...tempCitations[id], '']
        });
    };

    const cancelCitation = () => {
        setTempCitations({}); // clear the tempCitations
        setShowCitationInputId(null); // close the text area dropdown
    };

    return (
        <>
            {items.map(item => (
                <Box key={item.id}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography onClick={() => showCitationInput(item)}
                                    style={{cursor: 'pointer'}}>{item.name}</Typography>
                        <FormControlLabel
                            control={
                                <CustomSwitch
                                    checked={Boolean(item.citation)}
                                    onChange={() => showCitationInput(item)}
                                    icon={<CancelIcon style={{color: 'red'}}/>}
                                    checkedIcon={<CheckCircleIcon style={{color: 'green'}}/>}
                                />
                            }
                            label={''}/>
                    </Box>
                    <Collapse in={showCitationInputId === item.id}>
                        {tempCitations[item.id]?.map((citation, index) => (
                            <Box display="flex" alignItems="center" key={index}>
                                <TextField
                                    label="Citation"
                                    variant="outlined"
                                    multiline
                                    rows={6}
                                    value={citation}
                                    onChange={(event) => handleTempCitationChange(event, item.id, index)}
                                />
                                <Button onClick={() => saveCitation(item.id, item.name, index)} variant="text"
                                        sx={{ml: 1, color: colors.secondary}}>
                                    Save
                                </Button>
                                <Button onClick={() => cancelCitation()} variant="text" color="error"
                                        sx={{ml: 1}}>
                                    Cancel
                                </Button>
                            </Box>
                        ))}
                        <Button onClick={() => addCitation(item.id)} variant="contained"
                                sx={{m: 2, backgroundColor: colors.lightText}}>
                            Add other
                        </Button>
                    </Collapse>
                </Box>
            ))}
            {items.length === 0 && (
                <Typography>No {type} available</Typography>
            )}
        </>
    );
}

export default CitationList;