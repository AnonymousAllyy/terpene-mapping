import {Box, Button, FormControlLabel, TextField, Typography} from '@mui/material';
import Collapse from '@mui/material/Collapse';
import React from 'react';
import CustomSwitch from '../styles/CustomSwitch';
import {Item} from '@/interfaces';

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
            if (!tempCitations[item.id]) { // Only set tempCitations for this item if it hasn't been set yet
                setTempCitations({
                    ...tempCitations,
                    [item.id]: [item.citation || '']
                });
            }
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
                                />
                            }
                            label={''}
                        />
                    </Box>
                    <Collapse in={showCitationInputId === item.id}>
                        {tempCitations[item.id]?.map((citation, index) => (
                            <Box display="flex" alignItems="center" key={index}>
                                <TextField
                                    label="Citation"
                                    variant="outlined"
                                    multiline
                                    rows={8}
                                    value={citation}
                                    onChange={(event) => handleTempCitationChange(event, item.id, index)}
                                    sx={{width: '85%'}}
                                />
                                <Button onClick={() => saveCitation(item.id, item.name, index)} variant="text"
                                        color="success">
                                    Save
                                </Button>
                                <Button onClick={() => cancelCitation()} variant="text" color="error">
                                    Cancel
                                </Button>
                            </Box>
                        ))}
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