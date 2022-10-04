import React, { useContext, useEffect } from 'react';
import openSocket from 'socket.io-client';

//Contexts
import AllUsersContext from '../contexts/AllUsersContext';
import LogsContext from '../contexts/LogsContext';
import SocketContext from '../contexts/SocketContext';
import UserContext from '../contexts/UserContext';
import ChannelContext from '../contexts/ChannelContext';
import WebRTCContext from '../contexts/WebRTCContext';
import WhiteboardContext from '../contexts/WhiteboardContext';

//Socket 
import userSocket from '../sockets/userSocket';
import textChannelSocket from '../sockets/textChannelSocket';
import voiceChannelSocket from '../sockets/voiceChannelSocket';
import whiteboardChannelSocket from '../sockets/whiteboardChannelSocket';

import WhiteBoard from '../components/ChatPage/whiteboard/WhiteBoard';
import Chat from '../components/ChatPage/chat/Chat';

const useChat = () => {
  const { setSocket } = useContext(SocketContext);
  const userContext = useContext(UserContext);
  const logsContext = useContext(LogsContext);
  const allUsersContext = useContext(AllUsersContext);
  const channelContext = useContext(ChannelContext);
  const webRTCContext = useContext(WebRTCContext);
  const whiteboardContext = useContext(WhiteboardContext);
  
  useEffect(() => {
  }, [channelContext.selectedChannel.name])
  
  useEffect(() => {
    if (userContext.user.email !== null) {
      const socket = openSocket();
      setSocket(socket);
      channelContext.fetchTextChannels(logsContext.fetchAllMessages);
      channelContext.fetchVoiceChannels();
      channelContext.fetchWhiteboardChannels(); 
  
      userSocket(socket, userContext, channelContext, logsContext, allUsersContext);
      textChannelSocket(socket, logsContext, channelContext);
      voiceChannelSocket(socket, webRTCContext, channelContext);
      whiteboardChannelSocket(socket, channelContext, whiteboardContext);
    }
  },[userContext.isAuth]);
  
  const renderMain = () => {
    switch (channelContext.selectedChannel.type) {
      case 'text':
        return <Chat />
      case 'whiteboard':
        return <WhiteBoard />
    }
  }

  return [renderMain];
};

export default useChat;