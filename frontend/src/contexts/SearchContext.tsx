import React, { useState } from 'react';

type SearchContext = {
  destination: string;
  checkIn: Date;
  checkOut: Date;
  adultCount: number;
  childCount: number;
  hotelId: string;

  saveSearchValues: (
    destination: string,
    checkIn: Date,
    checkOut: Date,
    adultCount: number,
    childCount: number,
  ) => void;
};

export const SearchContext = React.createContext<SearchContext | undefined>(
  undefined,
);

type SearchContextProviderProps = {
  children: React.ReactNode;
};

export const SearchContextProvider = ({
  children,
}: SearchContextProviderProps) => {
  const [destination, setDestination] = useState<string>(
    () => sessionStorage.getItem('destination') || '',
  );
  const [checkIn, setCheckIn] = useState<Date>(
    () =>
      new Date(sessionStorage.getItem('checkIn') || new Date().toISOString()),
  );
  const [checkOut, setCheckOut] = useState<Date>(
    () =>
      new Date(sessionStorage.getItem('checkOut') || new Date().toISOString()),
  );
  const [adultCount, setAdultCount] = useState<number>(() =>
    parseInt(sessionStorage.getItem('adultCount') || '1'),
  );
  const [childCount, setChildCount] = useState<number>(() =>
    parseInt(sessionStorage.getItem('childCount') || '0'),
  );
  const [hotelId, setHotelId] = useState<string>(
    () => sessionStorage.getItem('hotelId') || '',
  );

  const saveSearchValues = (
    destination: string,
    checkIn: Date,
    checkOut: Date,
    adultCount: number,
    childCount: number,
    hotelId?: string,
  ) => {
    // Save search values to state of SearchContext
    setDestination(destination);
    setCheckIn(checkIn);
    setCheckOut(checkOut);
    setAdultCount(adultCount);
    setChildCount(childCount);
    if (hotelId) setHotelId(hotelId);

    // Save search values to session storage
    sessionStorage.setItem('destination', destination);
    sessionStorage.setItem('checkIn', checkIn.toISOString());
    sessionStorage.setItem('checkOut', checkOut.toISOString());
    sessionStorage.setItem('adultCount', adultCount.toString());
    sessionStorage.setItem('childCount', childCount.toString());
    if (hotelId) sessionStorage.setItem('hotelId', hotelId);
  };

  return (
    <SearchContext.Provider
      value={{
        destination,
        checkIn,
        checkOut,
        adultCount,
        childCount,
        hotelId,
        saveSearchValues,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

// export const useSearchContext = () => {
//   const context = React.useContext(SearchContext);
//   if (context === undefined) {
//     throw new Error(
//       'useSearchContext must be used within a SearchContextProvider',
//     );
//   }
//   return context as SearchContext;
// };
