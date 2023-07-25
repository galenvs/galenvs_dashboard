import React, { useState } from 'react';
import { AppBar, Toolbar, Box, Button, IconButton, Drawer, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import UploadFileIcon from '@mui/icons-material/Publish';
import ListIcon from '@mui/icons-material/List';
import FilterListIcon from '@mui/icons-material/FilterList';
import logo from '../../assets/ngslogo.svg';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [mobileView, setMobileView] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleResize = () => {
    return window.innerWidth <= 900 ? setMobileView(true) : setMobileView(false);
  };

  window.addEventListener('resize', handleResize);

  React.useEffect(() => {
    handleResize();
  }, []);

  const displayDesktop = () => {
    return (
      <Toolbar>
        <Box sx={{ flexGrow: 1, marginTop: "0.5rem" }}>
          <img src={logo} alt="logo" height={40} />
        </Box>
        {getMenuButtons()}
      </Toolbar>
    );
  };

  const displayMobile = () => {
    const handleDrawerOpen = () => setDrawerOpen(true);
    const handleDrawerClose = () => setDrawerOpen(false);

    return (
      <Toolbar>
        <Box sx={{ flexGrow: 1, marginTop: "0.5rem" }}>
          <img src={logo} alt="logo" height={40} />
        </Box>
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ marginRight: "auto" }} onClick={handleDrawerOpen}>
          <MenuIcon />
        </IconButton>

        <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerClose}>
          <List>{getDrawerChoices()}</List>
        </Drawer>
      </Toolbar>
    );
  };

  const getDrawerChoices = () => {
    return headersData.map(({ label, href, icon }) => {
      return (
        <Link key={label} to={href} style={{ textDecoration: 'none' }}>
          <ListItem button>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={label} sx={{ color: '#8a1538' }}/>
          </ListItem>
        </Link>
      );
    });
  };

  const getMenuButtons = () => {
    return headersData.map(({ label, href }) => {
      return (
        <Button key={label} variant="contained" color="primary" to={href} component={Link}  sx={{ borderRadius: 25, padding: "5px 10px", margin: "0px 10px", fontSize: "0.8rem", color: "#fff", backgroundColor: "#8a1538", '&:hover': { backgroundColor: '#000' } }}>
          {label}
        </Button>
      );
    });
  };

  const headersData = [
    { label: 'Zip Upload', href: '/', icon: <FolderZipIcon /> },
    { label: 'File Upload', href: '/fileUpload', icon: <UploadFileIcon /> },
    { label: 'Records', href: '/records', icon: <ListIcon /> },
    { label: 'Filter', href: '/tableFilter', icon: <FilterListIcon /> },
  ];

  return (
    <AppBar
      position="static"
      color="transparent"
      sx={{
        borderRadius: 50,
        margin: "10px auto",
        maxWidth: 1000,
        padding: "0px 10px",
        height: 60,
        boxShadow: "none",
      }}
    >
      {mobileView ? displayMobile() : displayDesktop()}
    </AppBar>
  );
};

export default Navbar;
