import React, { useEffect, useState } from "react";
import axios from "axios";
import { List, ListItem, ListItemText, IconButton, Grid, Container, ListItemSecondaryAction, Dialog, DialogActions, DialogTitle, Button, CircularProgress, Typography ,Box } from "@material-ui/core";
import { CloudDownloadOutlined, Delete, FolderOpen } from "@material-ui/icons";
import { Alert } from "@mui/material";
import { StyledTypography, DirectoryItem, StyledTextField } from "../style/styles";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import SimCardDownloadOutlinedIcon from "@mui/icons-material/SimCardDownloadOutlined";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";

interface Item {
  name: string;
  type: string;
}

const Records: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [currentPath, setCurrentPath] = useState<string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [alert, setAlert] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({ open: false, message: "", severity: "success" });

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

  const handleError = (error: any) => {
    console.error(error);
    setError(error.toString());
    setIsLoading(false);
  };

  const fetchItems = () => {
    setIsLoading(true);
    axios
      .get<Item[]>(`${import.meta.env.VITE_API_URL}/records/${currentPath}`)
      .then((response) => {
        setIsLoading(false);
        setItems(response.data);
      })
      .catch(handleError);
  };

  const navigateToDirectory = (dir: string) => {
    setCurrentPath((currentPath) => (currentPath ? `${currentPath}/${dir}` : dir));
  };

  const navigateUp = () => {
    setCurrentPath((path) => {
      const pathParts = path.split("/");
      pathParts.pop();
      return pathParts.join("/");
    });
  };

  const downloadFile = (filePath: string) => {
    window.open(`${import.meta.env.VITE_API_URL}/records/download/${currentPath}/${filePath}`);
  };

  const downloadFolder = (folderPath: string) => {
    window.open(`${import.meta.env.VITE_API_URL}/records/downloadFolder/${currentPath}/${folderPath}`);
  };

  const openDeleteDialog = (filePath: string) => {
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
        
        {!isLoading && filteredItems.length === 0 && (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    flexDirection="column"
    style={{ height: "50vh" }}
  >
    <Typography variant="h6" color="textSecondary">
      The folder is empty
    </Typography>
  </Box>
)}
      </Grid>
    </Container>
  );
};

export default Records;
