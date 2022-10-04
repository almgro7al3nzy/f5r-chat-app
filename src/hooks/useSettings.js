import { useContext } from 'react';

import server from '../apis/server';
import history from '../utilities/history';
import UserContext from '../contexts/UserContext';
import SocketContext from '../contexts/SocketContext';
import WebRTCContext from '../contexts/WebRTCContext';
import ChannelContext from '../contexts/ChannelContext';
import WhiteboardContext from '../contexts/WhiteboardContext';

const useSettings = () => {
  const { setIsAuth, setUser } = useContext(UserContext);
  const { socket } = useContext(SocketContext);
  const { leaveVoice } = useContext(WebRTCContext);
  const { selectedVoice, setSelectedVoice, setTalkers, selectedChannel } = useContext(ChannelContext);
  const { leaveWhiteboard } = useContext(WhiteboardContext);

  const handleOnSignout = () => {
    if (selectedChannel.type === 'whiteboard')
      leaveWhiteboard(socket, selectedChannel);
    
    server.post('/user/signout')
      .then(() => {
        setIsAuth(false);
        setUser({ 
          email: null, 
          displayName: null,
          socketId: null,
          photoURL: null,
        });
        history.push('/');
        if (selectedVoice) {
          setTalkers({});
          setSelectedVoice(''); 
          leaveVoice();
        }
        socket.disconnect();
      });
  };

  return [handleOnSignout];
};

export default useSettings;
