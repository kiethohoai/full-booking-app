import React from 'react';
import { SearchContext } from './SearchContext';

export const useSearchContext = () => {
  const context = React.useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearchContext must be used within a SearchContextProvider');
  }
  return context;
};
