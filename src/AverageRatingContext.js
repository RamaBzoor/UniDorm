// AverageRatingContext.js

import React, { createContext, useState } from "react";

const AverageRatingContext = createContext();

export const AverageRatingProvider = ({ children }) => {
  const [averageRating, setAverageRating] = useState(0);

  return (
    <AverageRatingContext.Provider value={{ averageRating, setAverageRating }}>
      {children}
    </AverageRatingContext.Provider>
  );
};

export const useAverageRating = () => React.useContext(AverageRatingContext);
