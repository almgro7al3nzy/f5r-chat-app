import React, { useState } from 'react';
import server from '../apis/server';

const AllUsersContext = React.createContext();

export default AllUsersContext;

export const AllUsersProvider = ({ children }) => {
  const [allUsers, setAllUsers] = useState([]);

  const fetchAllUsers = async () => {
    const response = await server.get('/user');
    setAllUsers(response.data);
  }

  return(
    <AllUsersContext.Provider value={{ allUsers, setAllUsers, fetchAllUsers }}>
      { children }
    </AllUsersContext.Provider>
  )
}