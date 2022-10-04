import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';

import UserContext from '../../contexts/UserContext';

const ProtectedRoute = props => {
  const { isAuth } = useContext(UserContext);

  const renderRoute = () => {
    if (isAuth === null) 
      return null; 
    else if (isAuth === false) 
      return <Redirect to={{ 
        pathname: "/signin", 
        state: { from: props.location.pathname } 
      }} />;
    else 
      return <Route {...props} />
  }

  return renderRoute();
};

export default ProtectedRoute;