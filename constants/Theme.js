import { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const systemTheme = useColorScheme();
  const [theme, setTheme] = useState(systemTheme);

  useEffect(() => {
    setTheme(systemTheme);
  }, [systemTheme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export const theme = 'dark'; // Default theme 