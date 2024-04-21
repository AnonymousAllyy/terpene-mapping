import {Box, Button, TextField, Typography} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import Collapse from '@mui/material/Collapse';
import React from 'react';

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

    const handleEditClick = (item: Item) => {
        setShowCitationInputId(item.id);
        setTempCitation(item.citation || '');
    };

    const handleTempCitationChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setTempCitation(event.target.value);
    };

    const saveCitation = (id: number, name: string) => {
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
                        <Typography>{item.name}</Typography>
                        {item.citation ? (
                            <CheckCircleIcon style={{color: 'green'}} onClick={() => handleEditClick(item)}/>
                        ) : (
                            <CancelIcon style={{color: 'red'}} onClick={() => handleEditClick(item)}/>
                        )}
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
                            <Button onClick={() => saveCitation(item.id, item.name)}>
                                Save
                            </Button>
                            <Button onClick={() => cancelCitation()}>
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