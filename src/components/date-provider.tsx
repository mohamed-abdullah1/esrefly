import React, { createContext, useState, useContext } from 'react';

// Define the shape of the context value
interface DateContextType {
  chosenDate: string;
  setChosenDate: React.Dispatch<React.SetStateAction<string>>;
}

// Create a context with a default value
const DateContext = createContext<DateContextType | undefined>(undefined);

// Provider component that will wrap your app
import { ReactNode } from 'react';

export const DateProvider = ({ children }: { children: ReactNode }) => {
  const [chosenDate, setChosenDate] = useState((new Date()).toISOString().split('T')[0]);

  // The value that will be available to consumer components
  const value = {
    chosenDate,
    setChosenDate
  };

  return (
    <DateContext.Provider value={value} >
      {children}
    </DateContext.Provider>
  );
};

// Custom hook to use the date context
export const useDateContext = () => {
  const context = useContext(DateContext);
  
  if (context === undefined) {
    throw new Error('useDateContext must be used within a DateProvider');
  }
  
  return context;
};