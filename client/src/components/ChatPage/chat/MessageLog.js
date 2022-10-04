import React, { useContext, useRef } from 'react';

import useLogs from '../../../hooks/useLogs';
import LogsContext from '../../../contexts/LogsContext';
import ChannelContext from '../../../contexts/ChannelContext';

const MessageLog = ()=> {
  let logsContainerRef = useRef(null);
  const [renderLogs] = useLogs(logsContainerRef);
  const { logs, appendLogs} = useContext(LogsContext);
  const { selectedChannel } = useContext(ChannelContext);

  return(
    <div className="logs-container">
      <button onClick={()=> appendLogs(selectedChannel.id)}>
        more messages
      </button>
      { renderLogs() }
      <div style={{ float:"left", clear: "both" }} ref={logsContainerRef}>
      </div>
    </div>
  )
}

export default MessageLog;