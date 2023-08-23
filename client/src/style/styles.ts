import { Box, Button, Container, FormControl, Typography, TextField, Select, Paper } from "@mui/material";
import { styled } from "@mui/system";
import { grey } from "@mui/material/colors";

const commonColors = {
  primary: "#8A1538",
  secondary: "#9A2742",
  tertiary: "#000000",
  section: "#f8f8f8",
  black: "#1a1a1a",
};

export const StyledPaper = styled(Paper)({
  width: "95%",
  padding: "10px 20px 20px 10px",
  marginBottom: "18px",
  borderRadius: "25px",
  backgroundColor: commonColors.section,
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.08)",
});
export const StyledContainer = styled(Container)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  marginTop: "0.5rem",
  backgroundColor: "#fff",
  padding:"20px",
});

export const StyledFormControl = styled(FormControl)({
  margin: "0.5rem 0",
});

export const StyledTypography = styled(Typography)(({ theme }) => ({
  margin: "0.5rem 0",
  color: commonColors.primary,

  "&.MuiTypography-h4": {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: commonColors.primary,
  },
  "&.MuiTypography-h5": {  
    fontSize: "0.9rem",
    fontWeight: 600,
    color: commonColors.black,
  },
  "&.MuiTypography-h6": {
    fontSize: "1.25rem",
    fontWeight: 700,
    color: commonColors.secondary,
  },
  "&.MuiTypography-body1": {
    fontSize: "0.8rem",
    fontWeight: 400,
    color: commonColors.tertiary,
  },

}));

export const StyledButton = styled(Button)({
  backgroundColor: commonColors.primary,
  color: "#fff",
  borderRadius: "50px",
  fontSize: "0.75rem",
  "&:hover": {
    backgroundColor: grey[900],
  },
});

export const StyledBox = styled(Box)({
  display: "flex",
  gap: "0.5rem",
  marginTop: "0.5rem",
});

export const recordsStyles = {
  container: {
    fontFamily: "Arial, sans-serif",
    margin: "0 auto",
    maxWidth: "600px",
    padding: "0 20px",
  },
  button: {
    backgroundColor: "#4CAF50",
    border: "none",
    color: "white",
    padding: "10px 24px",
    textAlign: "center",
    textDecoration: "none",
    display: "inline-block",
    fontSize: "16px",
    margin: "4px 2px",
    cursor: "pointer",
  },
  list: {
    listStyleType: "none",
    padding: 0,
  },
  listItem: {
    marginBottom: "10px",
  },
};

export const DirectoryItem = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  border: "1px solid #ddd",
  borderRadius: "5px",
  padding: "5px",
  width: "100%",
  transition: "background-color 0.3s ease",
  "&:hover": {
    backgroundColor: "#eee",
  },
  "& .MuiIconButton-root": {
    marginRight: theme.spacing(1),
  },
}));

export const StyledTextField = styled(TextField)({
  width: "100%",
  margin:"1rem 0rem",

  "& .MuiOutlinedInput-root": {
    borderRadius: 30,
    height: "35px",
    "& input": {
      padding: "10px 14px",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: commonColors.primary,
    },
  },
  "& label.Mui-focused, & .MuiOutlinedInput-input, & .MuiInputLabel-root": {
    color: commonColors.primary,
  },
  "& .MuiInputLabel-formControl": {
    top: "-10px",
  },
});



export const StyledSelect = styled(Select)({
  margin: "0.5rem 0",
  color: commonColors.primary,
  borderRadius: "50px",
  height: "35px",
  "& .MuiSelect-select": {
    paddingRight: "32px",
    padding: "8px 12px",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: commonColors.primary,
  },
"& label.Mui-focused, & .MuiOutlinedInput-input, & .MuiInputLabel-root": {
  color: commonColors.primary,
},
});

const landingPageButtonsStyle = {
  textDecoration: "none",
  color: "white",
  padding: "10px 20px",
  margin: "10px",
  background: commonColors.primary,
  borderRadius: "25px",
  display: "inline-flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px",
  transition: "all 0.3s",
  fontSize: "14px",
  fontWeight: "500",
  width: "80%",
  "&:hover": {
    background: "#a01d4b",
  },
};

export const landingPageStyles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "95vh",
    background: "#fff",
    fontFamily: "'Roboto', sans-serif",
    padding: "0 20px",
  },
  header: {
    marginBottom: "30px",
    textAlign: "center",
  },
  headerTitle: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#333",
    "@media (max-width: 600px)": {
      fontSize: "1.5rem",
    },
  },
  headerSubtitle: {
    fontSize: "1.2rem",
    color: "#555",
    "@media (max-width: 600px)": {
      fontSize: "1rem",
    },
  },
  flexContainer: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  section: {
    width: "40%",
    margin: "20px",
    padding: "30px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.08)",
    borderRadius: "50px",
    backgroundColor: "#f9f9f9",
    textAlign: "center",
    transition: "all 0.3s",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    "@media (max-width: 800px)": {
      width: "80%",
      margin: "10px 0",
      padding: "20px",
    },
  },
  logo: {
    maxWidth: "80%",
    maxHeight: "50%",
    marginBottom: "20px",
  },
  button: {
    ...landingPageButtonsStyle,
    "@media (max-width: 600px)": {
      fontSize: "12px",
      padding: "8px 16px",
    },
  },
};
