import React, {createContext, useContext, useState} from 'react';
import {lightTheme, darkTheme, sizeDefault} from './Themes';
import ThemeProps from './ThemeProps';

interface ThemeContextProps {
  theme: ThemeProps;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);
const light: ThemeProps = {...lightTheme, ...sizeDefault};
const dark: ThemeProps = {...darkTheme, ...sizeDefault};
export default function ThemeProvider({children}: {children: React.ReactNode}) {
  const [theme, setTheme] = useState<ThemeProps>(light);
  const toggleTheme = () => {
    setTheme((prevTheme: ThemeProps) => {
      return prevTheme === lightTheme ? dark : light;
    });
  };
  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
