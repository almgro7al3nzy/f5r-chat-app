import React from 'react';
import Paper from '@material-ui/core/Paper';

import '../../../styles/Chat.css';
import MessageBox from './MessageBox';
import MessageLog from './MessageLog';

const Chat = () => {
  return (
  <>
    <Paper className="log-container">
      <MessageLog/>
    </Paper>
    <Paper className="chat-box-container">
      <MessageBox/>
    </Paper>
  </>
  );
}

export default Chat;