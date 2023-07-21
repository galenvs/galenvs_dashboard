import React from 'react'
import ReactDOM from 'react-dom/client'
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import App from './App.tsx'

const theme = createTheme({
  palette: {
    primary: {
      main: '#8a1538',
    },
    secondary: {
      main: '#009688',
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
    <App />
    </ThemeProvider>
  </React.StrictMode>,
)
