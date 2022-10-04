import React, {useContext} from 'react';
import TextField from '@material-ui/core/TextField';

import useMessageBox from '../../../hooks/useMessageBox';
import ChannelContext from '../../../contexts/ChannelContext';
import '../../../styles/MessageBox.css';

const MessageBox = ()=>{
  const [message, handleOnChange, handleOnSubmit, handleOnKeyPress] = useMessageBox();
  const { selectedChannel } = useContext(ChannelContext);

  return(
    <form className="chat-form" onSubmit={handleOnSubmit}>
      <TextField
        className="message-box"
        id="standard-textarea"
        label= { "#" + selectedChannel.name}
        placeholder="Type message here"
        value={message.text}
        multiline
        onKeyPress={handleOnKeyPress}
        onChange={handleOnChange}
        onFocus={ e => document.querySelector('#standard-textarea-label').style.transform = 'translate(0, 1.5px) scale(0.75)' }
        onBlur={ e=> document.querySelector('#standard-textarea-label').style.transform = 'translate(0, 17px) scale(1)' }
      />
    </form>
  )
}

export default MessageBox;
