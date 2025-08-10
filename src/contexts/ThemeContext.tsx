import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

// de el data elly hatb2a gowa el context - ya3ny eh mawgood gowa el theme
interface ThemeContextType {
  darkMode: boolean; 
  toggleDarkMode: () => void; 
}

// de bta3mel el context beta3na - zay container kbeer yeht feeh el theme
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);


export const useCustomTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useCustomTheme must be used within a ThemeProvider');
  }
  return context;
};

// da el component el kbeer elly hayelef kol el app w yedy kol haga el theme
export const CustomThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // da el state elly bey2ool ehna fe dark mode wala light mode - default light
  const [darkMode, setDarkMode] = useState(false);

  // lama el component yeshtghal awel marra, shoof law feeh theme mahfooz fel browser
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode'); 
    if (savedDarkMode) {
      setDarkMode(savedDarkMode === 'true');
    }
  }, []); // el array el fadya de ma3naha yeshtghal marra wahda bas

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode; 
    setDarkMode(newDarkMode); 
    localStorage.setItem('darkMode', newDarkMode.toString()); 
  };

  // de bta3mel el theme beta3 MUI - kol el alwan wel styles
  const theme = createTheme({
    palette: { 
      mode: darkMode ? 'dark' : 'light', 
      primary: {
        main: '#1e3a8a', 
      },
      secondary: {
        main: '#7c3aed', 
      },
      background: {
        default: darkMode ? '#0f172a' : '#ffffff', 
        paper: darkMode ? '#1e293b' : '#ffffff', 
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: darkMode ? '#0f172a' : '#ffffff',
            transition: 'background-color 0.3s ease', // 3ashan el taghyeer yeb2a smooth mesh fag2a
          },
        },
      },
    },
  });

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};