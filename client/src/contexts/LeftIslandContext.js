import React, { useState } from 'react';

const LeftIslandContext = React.createContext();

export const LeftIslandProvider = ({ children }) => {
  const [showLeftIsland, setShowLeftIsland] = useState(false);

  return (
    <LeftIslandContext.Provider value={{ showLeftIsland, setShowLeftIsland }}>
      { children }
    </LeftIslandContext.Provider>
  )
}

export default LeftIslandContext;