import moment from 'moment';
import React, { useContext, useEffect, useRef } from "react";
import LogsContext from '../contexts/LogsContext';
import ChannelContext from '../contexts/ChannelContext';

const useLogs = (logsContainerRef) => {
  const { logs, appendLogs } = useContext(LogsContext);
  const { selectedChannel } = useContext(ChannelContext);

  useEffect(()=>{
    if(logsContainerRef) {
      logsContainerRef.current.scrollIntoView();
    }
    
  },[logs])

  const renderLogs2 = () => {
    return logs?.map((log, i) => {
      if(i === 0 ) console.log(log.sender);
      if(!log.sender) return log;
      const previousUser = i > 0 && !React.isValidElement(logs[i-1])? logs[i-1].sender.email : null;
      const currentUser = log.sender.email;
      const previousTime = i > 0 && !React.isValidElement(logs[i-1])? logs[i-1].createdAt : new Date(-8640000000000000); //before common era
      const currentTime = log.createdAt;

      return !isSameUser(previousUser, currentUser) || !isRecent(previousTime, currentTime)? (
        <div className="log">
          <div>
            <img className="avatar" src={log.sender.photoURL}/>
          </div>
          <div>
            <div className="message-header-container">
              <div className="displayName-text">{log.sender.displayName}</div>
              <div className="timestamp-text">{moment(log.createdAt).calendar()}</div>
            </div>
            <div className="whitney-book message">{log.content}</div>
          </div>
        </div>
      ) : (
        <div className="appended-message">
          <span className="hover-timestamp timestamp-text">{moment(log.createdAt).format('LT')}</span>
          <span className="whitney-book message">{log.content}</span>
        </div>
      )
    })
  }

  const isSameUser = (previousUser, currentUser) => previousUser === currentUser;

  const isRecent = (previousTime, currentTime) => moment(currentTime).diff(moment(previousTime), 'seconds') <= 5;
  
  const renderLogs = () => {
    let logs = renderLogs2();
    if(!logs) logs = [];
    //welcome text 
  
    // logs.unshift(
    //   <div className="channel-welcome">
    //     {/* picture here logo or something */}
    //     <div className="channel-welcome-title">
    //       Welcome to #
    //     {selectedChannel.name}!
    //     </div>
    //     <div className="channel-welcome-subtext">
    //       This is the start of the #{selectedChannel.name} channel.
    //       <div className="edit-channel">
    //         Edit Channel
    //       </div>
    //     </div>
    //   </div>
    //   )
      return logs; 
  }

  return [renderLogs];
}

export default useLogs;
