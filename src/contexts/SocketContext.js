import React, { useState } from 'react';

const SocketContext = React.createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  return (
    <SocketContext.Provider value={{ socket, setSocket }}>
      { children }
    </SocketContext.Provider>
  )
}

export default SocketContext;