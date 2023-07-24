import React from "react";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import logo from "../../assets/ngslogo.svg";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
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
      <Toolbar sx={{ justifyContent: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <Box sx={{ display: "flex", gap: "10px" }}>
            <Link to="/">
              <Button variant="outlined" size="small" sx={{ borderRadius: 25, padding: "5px 15px", color: "#8a1538", borderColor: "#8a1538" }}>
                Zip Upload
              </Button>
            </Link>
            <Link to="/fileUpload">
              <Button variant="outlined" size="small" sx={{ borderRadius: 25, padding: "5px 15px", color: "#8a1538", borderColor: "#8a1538" }}>
                File Upload
              </Button>
            </Link>
          </Box>
          <Box>
            <img src={logo} alt="logo" height={40} />
          </Box>
          <Box sx={{ display: "flex", gap: "10px" }}>
            <Link to="/records">
              <Button variant="outlined" size="small" sx={{ borderRadius: 25, padding: "5px 15px", color: "#8a1538", borderColor: "#8a1538" }}>
                Records
              </Button>
            </Link>
            <Link to="/pgxResults">
              <Button variant="outlined" size="small" sx={{ borderRadius: 25, padding: "5px 15px", color: "#8a1538", borderColor: "#8a1538" }}>
               Filter
              </Button>
            </Link>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
