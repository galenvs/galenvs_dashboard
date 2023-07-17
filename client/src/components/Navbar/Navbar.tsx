import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material'; 
import logo from '../../assets/ngs.svg';

const Navbar: React.FC = () => {
  return (
    <AppBar position="static" color="transparent" sx={{ borderRadius: 50, margin: '10px auto', maxWidth: 500, padding: '0px 10px', height: 60, boxShadow: 'none' }}>
      <Toolbar sx={{ justifyContent: 'center' }}>
        <Box>
          <img src={logo} alt="logo" height={40} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
