import React, { useState, useRef, useContext } from 'react';
import server from '../apis/server';
import { MESSAGE_LIMIT } from '../configs'
import ChannelContext from '../contexts/ChannelContext';

const LogsContext = React.createContext();

export const LogsProvider = ({ children }) => {
  const messageMapRef = useRef({});
  const [logs, setLogs] = useState([]);
  const { selectedChannel } = useContext(ChannelContext);

  const fetchMessages = async (channelName, limit) => {
    // const response = await server.get('/message',  { params: { channelName, limit } });
    // setLogs(response.data);
  }

  const fetchAllMessages = async (channelNames, limit) => {
    const response = await server.post('/message/all', { channelNames, limit });
    messageMapRef.current = response.data;
    setLogs(Object.values(response.data)[0]); // 0 is always first channel and is valid
  }

  const appendLogs = async (channelName) => {
    const welcomeLog = (     
      <div className="channel-welcome">
        {/* picture here logo or something */}
        <div className="channel-welcome-title">
          Welcome to #
        {selectedChannel.name}!
        </div>
        <div className="channel-welcome-subtext">
          This is the start of the #{selectedChannel.name} channel.
          <div className="edit-channel">
            Edit Channel
          </div>
        </div>
      </div>
    );
    server.get('/message',  { params: { channelName, limit: MESSAGE_LIMIT, skip: logs.length } })
    .then(response => {
      if(response.data.length < 50 && !React.isValidElement(logs[0])) {
        setLogs([welcomeLog, ...response.data, ...logs ]);
      } else setLogs([...response.data, ...logs ]);
    });
  }

  return (
    <LogsContext.Provider value={ { logs, setLogs, fetchMessages, fetchAllMessages, messageMapRef, appendLogs } }>
      { children }
    </LogsContext.Provider>
  );
};

export default LogsContext;
