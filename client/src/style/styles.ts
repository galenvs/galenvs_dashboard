import { Box, Button, Container, FormControl, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { grey, lightBlue, red } from '@mui/material/colors';

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
