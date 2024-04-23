import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const Navbar: React.FC = () => {
    return (
        <AppBar position="static" sx={{backgroundColor: '#526D82'}}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Terpene Mapping
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;