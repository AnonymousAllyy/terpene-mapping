// TerpeneSelect.tsx
import React from 'react';
import {Select, MenuItem, SelectChangeEvent} from '@mui/material';
import { Terpene } from '@/interfaces';

interface TerpeneSelectProps {
    terpenes: Terpene[];
    selectedTerpeneId: number | undefined;
    handleTerpeneChange: (event: SelectChangeEvent<number>) => void;
}

const TerpeneSelect: React.FC<TerpeneSelectProps> = ({ terpenes, selectedTerpeneId, handleTerpeneChange }) => {
    return (
            <Select
            value={selectedTerpeneId || ''}
            onChange={handleTerpeneChange}
            sx={{
                width: '100%',
                backgroundColor: '#DDE6ED',
                borderRadius: '10px',
            }}
            MenuProps={{
                PaperProps: {
                    style: {
                        maxHeight: 300,
                    },
                },
            }}
        >

            {terpenes.map((terpene, index) => (
                <MenuItem
                    key={terpene.TerpeneID}
                    value={terpene.TerpeneID}
                    sx={{backgroundColor: index % 2 === 0 ? 'action.hover' : 'background.paper'}}
                >
                    {terpene.Terpene}
                </MenuItem>
            ))}
        </Select>
    );
};

export default TerpeneSelect;