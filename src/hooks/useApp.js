import { useContext, useEffect } from 'react';

import server from '../apis/server';
import UserContext from '../contexts/UserContext';

const useApp = () => {
	const { setUser, setIsAuth } = useContext(UserContext);
  
  useEffect(() => {
    server.get('/user/check')
      .then(response => { 
        setUser(response.data);
        setIsAuth(true);
      })
      .catch(error => { 
        setIsAuth(false);
      });
	}, [])
}

export default useApp;