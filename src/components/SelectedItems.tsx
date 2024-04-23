import React from 'react';
import {Box, Typography} from '@mui/material';
import CitationList from '@/components/CitationList';
import {Item} from '@/interfaces';
import colors from '../styles/colors';

interface SelectedItemsProps {
    items: Item[];
    type: 'Smell' | 'Taste' | 'Property';
    handleCitationChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, id: number) => void;
    openSnackbar: (message: string) => void;
}

const SelectedItems: React.FC<SelectedItemsProps> = ({ items, type, handleCitationChange, openSnackbar }) => {
    const getPluralType = (type: 'Smell' | 'Taste' | 'Property') => {
        switch (type) {
            case 'Smell':
                return 'Smells';
            case 'Taste':
                return 'Tastes';
            case 'Property':
                return 'Properties';
            default:
                return '';
        }
    };

    return (
        <Box sx={{p: 2, overflow: 'auto', maxHeight: '500px', margin: '10px', border: '1px solid #fff'}}>
            <Typography variant="h2" sx={{
                fontSize: '1.5rem',
                color: colors.text,
                marginBottom: '10px'
            }}>Selected {getPluralType(type)}:</Typography>
            <CitationList
                items={items}
                type={type}
                handleCitationChange={handleCitationChange}
                openSnackbar={openSnackbar}
            />
        </Box>
    );
};

export default SelectedItems;