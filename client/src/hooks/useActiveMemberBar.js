import React, { useContext, useState, useEffect } from 'react';
import AllUsersContext from '../contexts/AllUsersContext';

const useActiveMemberBar = () => {
  const { allUsers } = useContext(AllUsersContext);
  let userList = { onlines: [], offlines: [] };
  
  const filterAllUsers = () => {
    let onlines = [];
    let offlines = [];
    
    allUsers.forEach(user => {
      user.socketId
        ? onlines.push(renderUser(user)) 
        : offlines.push(renderUser(user));
    });
    
    userList = { onlines, offlines };
  }


  const renderUser = user => {
    return(
      <div className="user-container" style={!user.socketId ? {opacity: ".3"} : null}>
        <div className="member-pic-container">
          <img className="member-pic" src={user.photoURL} />
          {
            user.socketId && <div className="status-container">
              <svg width="19" height="19">
                <circle 
                  r="7" 
                  cx="9.5" 
                  cy="9.5" 
                  fill="#43b581" 
                  stroke="#2f3136" 
                  stroke-width="2.5" />
              </svg>
            </div>
          }

        </div>
        <div className="username">
          {user.displayName}
        </div>
      </div>
    );
  };

  filterAllUsers();
  
  return [userList];
};

export default useActiveMemberBar;