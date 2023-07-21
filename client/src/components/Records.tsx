import React, { useEffect, useState } from "react";
import axios from "axios";
import { List, ListItem, ListItemText, IconButton, Grid, Container, ListItemSecondaryAction, Dialog, DialogActions, DialogTitle, Button, CircularProgress, Typography } from "@material-ui/core";
import { CloudDownloadOutlined, Delete, FolderOpen } from "@material-ui/icons";
import { Alert } from "@mui/material";
import { StyledTypography, DirectoryItem, StyledTextField } from "../style/styles";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import SimCardDownloadOutlinedIcon from "@mui/icons-material/SimCardDownloadOutlined";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";

const Records = () => {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [currentPath, setCurrentPath] = useState("");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [fileToDelete, setFileToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });
  
    useEffect(() => {
      fetchItems();
    }, [currentPath]);
  
    useEffect(() => {
      if (searchQuery === "") {
        setFilteredItems(items);
      } else {
        setFilteredItems(items.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase())));
      }
    }, [items, searchQuery]);
  
    const handleError = (error) => {
      console.error(error);
      setError(error.toString());
      setIsLoading(false);
    };
  
    const fetchItems = () => {
      setIsLoading(true);
      axios.get(`${import.meta.env.VITE_API_URL}/records/${currentPath}`)
        .then((response) => {
          setIsLoading(false);
          setItems(response.data);
        })
        .catch(handleError);
    };
  
    const navigateToDirectory = (dir) => {
      setCurrentPath((currentPath) => (currentPath ? `${currentPath}/${dir}` : dir));
    };
  
    const navigateUp = () => {
      setCurrentPath((path) => {
        const pathParts = path.split("/");
        pathParts.pop();
        return pathParts.join("/");
      });
    };
  
    const downloadFile = (filePath) => {
      window.open(`${import.meta.env.VITE_API_URL}/records/download/${currentPath}/${filePath}`);
    };
  
    const downloadFolder = (folderPath) => {
      window.open(`${import.meta.env.VITE_API_URL}/records/downloadFolder/${currentPath}/${folderPath}`);
    };
  
    const openDeleteDialog = (filePath) => {
      setFileToDelete(filePath);
      setDeleteDialogOpen(true);
    };
  
    const closeDeleteDialog = () => {
      setDeleteDialogOpen(false);
    };
  
    const deleteFile = () => {
      setIsLoading(true);
      axios
        .delete(`${import.meta.env.VITE_API_URL}/records/delete/${currentPath}/${fileToDelete}`)
        .then(() => {
          setIsLoading(false);
          fetchItems(); // Refresh the file list after deletion
          closeDeleteDialog();
          setAlert({ open: true, message: "File deleted successfully.", severity: "success" });
        })
        .catch((error) => {
          handleError(error);
          setAlert({ open: true, message: "Failed to delete file.", severity: "error" });
        });
    };

  return (
    <Container>
      {isLoading && (
        <div style={{ display: "flex", justifyContent: "center", padding: "1em" }}>
          <CircularProgress />
        </div>
      )}
      {error && (
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      )}
      {alert.open && (
        <Alert onClose={() => setAlert({ open: false, message: "", severity: "success" })} severity={alert.severity}>
          {alert.message}
        </Alert>
      )}
      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Are you sure you want to delete this file?</DialogTitle>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Cancel</Button>
          <Button onClick={deleteFile} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <FolderOpenIcon />
            <StyledTypography variant="h6" align="center" style={{ margin: "20px 0" }}>
              {currentPath ? `Records/${currentPath}` : "Records"}
            </StyledTypography>
          </div>
        </Grid>
        <Grid item xs={12} style={{ display: "flex", justifyContent: "flex-end" }}>
          {currentPath && (
            <div style={{ marginRight: "auto" }}>
              <IconButton onClick={navigateUp}>
                <KeyboardArrowLeftOutlinedIcon />
              </IconButton>
            </div>
          )}
          <StyledTextField label="Search" variant="outlined" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </Grid>

        <Grid item xs={12}>
          <List>
            {filteredItems.map((item) => (
              <ListItem key={item.name}>
                {item.type === "directory" && (
                  <DirectoryItem onClick={() => navigateToDirectory(item.name)}>
                    <IconButton color="primary" size="small">
                      <FolderOpen fontSize="small" />
                    </IconButton>
                    <ListItemText primary={item.name} />
                    <ListItemSecondaryAction>
                      <IconButton
                        onClick={(event) => {
                          event.stopPropagation();
                          downloadFolder(item.name);
                        }}
                        size="small"
                      >
                        <SimCardDownloadOutlinedIcon fontSize="inherit" />
                      </IconButton>
                      <IconButton
                        onClick={(event) => {
                          event.stopPropagation();
                          openDeleteDialog(item.name);
                        }}
                        color="primary"
                        size="small"
                      >
                        <Delete fontSize="inherit" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </DirectoryItem>
                )}
                {item.type !== "directory" && (
                  <React.Fragment>
                    <ListItemText primary={item.name} />
                    <ListItemSecondaryAction>
                      <IconButton onClick={() => downloadFile(item.name)} size="small">
                        <CloudDownloadOutlined fontSize="inherit" />
                      </IconButton>
                      <IconButton onClick={() => openDeleteDialog(item.name)} color="primary" size="small">
                        <Delete fontSize="inherit" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </React.Fragment>
                )}
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Records;
