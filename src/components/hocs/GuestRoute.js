import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

import UserProvider from '../../contexts/UserContext';


const GuestRoute = props => {
    const { isAuth } = useContext(UserProvider);

    const renderRoute = () => {
        if (isAuth === null) return null;
        else if (isAuth === false) return <Route { ...props } />;
        else return <Redirect to="/chat" />
    }
    
    return renderRoute();
};

export default GuestRoute;