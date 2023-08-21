import { Box, Button, Container, FormControl, Typography , IconButton, ListItemText , TextField , Select } from '@mui/material';
import { styled } from '@mui/system';
import { grey, lightBlue, red } from '@mui/material/colors';
import { makeStyles } from "@mui/styles";


export const StyledContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '0.5rem',
  backgroundColor: '#fff',
});

export const StyledFormControl = styled(FormControl)({
  margin: '0.5rem 0',
});

export const StyledTypography = styled(Typography)(({ theme }) => ({
  margin: '0.5rem 0',
  color: '#8A1538',
  '&.MuiTypography-h4': {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#8A1538', // darkest color for the most important headers
  },
  '&.MuiTypography-h6': {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#9A2742', // slightly lighter color for sub-headers
  },
  '&.MuiTypography-body1': {
    fontSize: '0.8rem',
    fontWeight: 400,
    color: '#000000', // lightest color for body text
  },
}));

export const StyledButton = styled(Button)({
  backgroundColor: '#8A1538',
  color: '#fff',
  fontSize: '0.75rem',
  '&:hover': {
    backgroundColor: grey[900],
  },
});

export const StyledBox = styled(Box)({
  display: 'flex',
  gap: '0.5rem',
  marginTop: '0.5rem',
});

export const recordsStyles = {
  container: {
      fontFamily: 'Arial, sans-serif',
      margin: '0 auto',
      maxWidth: '600px',
      padding: '0 20px',
  },
  button: {
      backgroundColor: '#4CAF50',
      border: 'none',
      color: 'white',
      padding: '10px 24px',
      textAlign: 'center',
      textDecoration: 'none',
      display: 'inline-block',
      fontSize: '16px',
      margin: '4px 2px',
      cursor: 'pointer',
  },
  list: {
      listStyleType: 'none',
      padding: 0,
  },
  listItem: {
      marginBottom: '10px',
  },
};
export const DirectoryItem = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  border: '1px solid #ddd',
  borderRadius: '5px',
  padding: '5px',
  width: '100%',
  transition: 'background-color 0.3s ease',
  '&:hover': {
      backgroundColor: '#eee',
  },
  '& .MuiIconButton-root': {
      marginRight: theme.spacing(1),
  },
}));


export const StyledTextField = styled(TextField)({
  width: '400px', // Adjust the width as needed
  '& .MuiOutlinedInput-root': {
    borderRadius: 30,
    height: '35px', // Adjust the height as needed
    '& fieldset': {
      borderRadius: 30,
    },
    '& input': {
      padding: '10px 14px',
    },
  },
  '& label.Mui-focused': {
    color: '#8a1538',
  },
  '& .MuiOutlinedInput-input': {
    color: '#8a1538',
  },
  '& .MuiInputLabel-root': {
    color: '#8a1538',
  },
  '& .MuiInputLabel-formControl': {
    top: '-10px', // Adjust this to vertically center the label
  },
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#8a1538',
  },
});


export const StyledSelect = styled(Select)`
  margin-bottom: 1rem;
  border-radius: 50px;
  width: 200px;
  & .MuiSelect-select {
    padding-right: 32px;
  }
`;


  const sectionStyle = {
    width: '40%', 
    margin: '20px', 
    padding: '30px', 
    border: '1px solid #e6e6e6', 
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    textAlign: 'center',
    transition: 'all 0.3s'
  };

  const buttonStyle = {
    textDecoration: 'none',
    color: 'white',
    padding: '10px 20px',
    margin: '10px',
    background: '#8A1538',
    borderRadius: '25px',
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    transition: 'all 0.3s',
    fontSize: '14px',
    fontWeight: '500',
    width: '80%',
    '&:hover': {
      background: '#a01d4b'
    }
  };


  export const landingPageStyles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '95vh',
      background: '#fff',
      fontFamily: "'Roboto', sans-serif",
      padding: '0 20px',  
    },
    header: {
      marginBottom: '30px',
      textAlign: 'center',
    },
    headerTitle: {
      fontSize: '2rem',  
      fontWeight: '700',
      color: '#333',
      '@media (max-width: 600px)': {  
        fontSize: '1.5rem',
      }
    },
    headerSubtitle: {
      fontSize: '1.2rem',
      color: '#555',
      '@media (max-width: 600px)': {
        fontSize: '1rem',
      }
    },
    flexContainer: {
      display: 'flex',
      width: '100%',
      justifyContent: 'center',
      flexWrap: 'wrap',  
    },
    section: {
      width: '40%',
      margin: '20px',
      padding: '30px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.08)',
      borderRadius: '50px',
      backgroundColor: '#f9f9f9',
      textAlign: 'center',
      transition: 'all 0.3s',
      flexDirection: 'column',
      alignItems: 'center',  
      justifyContent: 'center',  
      '@media (max-width: 800px)': {  
        width: '80%',
        margin: '10px 0',
        padding: '20px',
      }
    },
    logo: {
      maxWidth: '80%',  // set a maximum width as a percentage of the container
      maxHeight: '50%',  // set a maximum height as a percentage of the container
      marginBottom: '20px',
    },
    button: {
      textDecoration: 'none',
      color: 'white',
      padding: '10px 20px',
      margin: '10px',
      background: '#8A1538',
      borderRadius: '25px',
      display: 'inline-flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '10px',
      transition: 'all 0.3s',
      fontSize: '14px',
      fontWeight: '500',
      width: '80%',
      '&:hover': {
        background: '#a01d4b',
      },
      '@media (max-width: 600px)': {
        fontSize: '12px',
        padding: '8px 16px',
      }
    },
  };
  
  
  