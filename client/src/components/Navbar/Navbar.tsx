import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AppBar, Toolbar, Box, IconButton, Drawer, List, ListItem, ListItemText } from "@mui/material";
import { StyledTypography } from "../../style/styles";
import MenuIcon from "@mui/icons-material/Menu";
import mainLogo from "../../assets/logos/mainPageLogo.svg";
import ngsLogo from "../../assets/logos/ngsLogo.svg";
import predictorsLogo from "../../assets/logos/predictorsLogo.svg";
import { Link } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";

const Navbar: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
  const [hovered, setHovered] = useState(false);
  const location = useLocation();

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 900);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isPortal = location.pathname === "/";

  const headersData = isPortal
    ? []
    : location.pathname.includes("/ngs")
    ? [
        { label: "Report Generator", href: "/ngs/reportGenerator" },
        { label: "Records", href: "/ngs/records" },
        { label: "Filter", href: "/ngs/tableFilter" },
      ]
    : [
        { label: "Pathogen", href: "/predictor/pathogen" },
        { label: "Blood ", href: "/predictor/blood" },
        { label: "Else ", href: "/predictor/else" },
      ];

  const getLogoSrc = () => {
    if (location.pathname.includes("/ngs")) {
      return ngsLogo;
    } else if (location.pathname.includes("/predictor")) {
      return predictorsLogo;
    } else {
      return mainLogo;
    }
  };
  const controls = useAnimation();

  const handleMouseEnter = () => {
    controls.start("hovered");
    setHovered(true);
  };

  const handleMouseLeave = () => {
    controls.start("unhovered");
    setHovered(false);
  };

  const imageVariants = {
    hovered: {
      scale: 1.05,
      opacity: 0.9,
      transition: { duration: 2.0 },
    },
    unhovered: {
      scale: 1,
      opacity: 1,
      transition: { duration: 2.0 },
    },
  };
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
      <Toolbar style={{ justifyContent: isPortal ? "center" : "space-between" }}>
        <Box sx={{ flexGrow: isPortal ? 0 : 1, marginTop: "0.5rem" }}>
          <Link to="/">
            <motion.img src={hovered ? mainLogo : getLogoSrc()} alt="logo" height={35} variants={imageVariants} initial="unhovered" animate={controls} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />
          </Link>
        </Box>
        {!isPortal &&
          !isMobile &&
          headersData.map(({ label, href }) => (
            <Link key={label} to={href} style={{ textDecoration: "none", marginRight: 20 }}>
              <StyledTypography
                variant="h5"
                style={{
                  cursor: "pointer",
                  color: location.pathname === href ? "#8a1538" : "black",
                  borderBottom: location.pathname === href ? "2px solid #8a1538" : "none",
                  paddingBottom: 5,
                }}
              >
                {label}
              </StyledTypography>
            </Link>
          ))}
        {!isPortal && isMobile && (
          <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(!drawerOpen)}>
            <MenuIcon />
          </IconButton>
        )}
        <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <List>
            {headersData.map(({ label, href }) => (
              <Link key={label} to={href} style={{ textDecoration: "none" }}>
                <ListItem button onClick={() => setDrawerOpen(false)}>
                  <ListItemText primary={label} sx={{ color: "#8a1538" }} />
                </ListItem>
              </Link>
            ))}
          </List>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
