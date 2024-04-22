import {Box, Button, FormControlLabel, TextField, Typography} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import Collapse from '@mui/material/Collapse';
import React from 'react';
import CustomSwitch from '@/styles/CustomSwitch';

interface Item {
    id: number;
    name: string;
    citation: string | null;
}

interface CitationListProps {
    items: Item[];
    type: 'Smell' | 'Taste' | 'Property';
    handleCitationChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, id: number) => void;
    openSnackbar: (message: string) => void;
}


const CitationList: React.FC<CitationListProps> = ({items, type, handleCitationChange, openSnackbar}) => {
    const [tempCitation, setTempCitation] = React.useState<string | null>(null);
    // ID of the citation currently being edited. When a citation is clicked, this is set to the clicked citation's ID, causing the citation input field for that citation to be displayed.
    const [showCitationInputId, setShowCitationInputId] = React.useState<number | null>(null);

    const showCitationInput = (item: Item) => {
        if (showCitationInputId === item.id) {
            setShowCitationInputId(null); // Close the text area
        } else {
            setShowCitationInputId(item.id); // Open the text area
            setTempCitation(item.citation || '');
        }
    };

    const handleTempCitationChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setTempCitation(event.target.value);
    };

    const saveCitation = (id: number, name: string) => {
        // Get the current citation for the item
        const currentCitation = items.find(item => item.id === id)?.citation || '';
        // If the new citation is the same as the current citation, return early
        if (tempCitation === currentCitation) {
            return;
        }

        handleCitationChange({target: {value: tempCitation}} as React.ChangeEvent<HTMLInputElement>, id);
        setTempCitation(tempCitation); // set tempCitation to the new citation
        openSnackbar(`Citation for ${type}: ${name} has been updated`);
    };

    const cancelCitation = () => {
        setTempCitation(''); // clear the tempCitation
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
                        <Box display="flex" alignItems="center">
                            <TextField
                                label="Citation"
                                variant="outlined"
                                multiline
                                rows={6}
                                value={tempCitation || ''}
                                onChange={handleTempCitationChange}
                            />
                            <Button onClick={() => saveCitation(item.id, item.name)} variant="text" color="primary"
                                    sx={{ml: 1, fontWeight: 700}}>
                                Save
                            </Button>
                            <Button onClick={() => cancelCitation()} variant="text" color="error"
                                    sx={{ml: 1, fontWeight: 700}}>
                                Cancel
                            </Button>
                        </Box>
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