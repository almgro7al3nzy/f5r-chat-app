import { useState, useContext } from 'react';
import SocketContext from '../contexts/SocketContext';
import UserContext from '../contexts/UserContext';
import server from '../apis/server';
import ChannelContext from '../contexts/ChannelContext';

const useMessageBox = () => {
  const [message, setMessage] = useState({ text: '' });
  const { socket } = useContext(SocketContext);
  const { user } = useContext(UserContext);
  const { displayName, photoURL } = user;
  const { selectedChannel } = useContext(ChannelContext);


  const handleOnChange = e => {
    setMessage({text: e.target.value});
  }

  const handleOnSubmit = e => {
    e.preventDefault();
    if (message.text.trim().length === 0) return;
    message.text = message.text.trim();
    socket.emit('send message', { message, displayName, photoURL, selectedChannel: selectedChannel.id, createdAt: Date() });
    server.post('/message', { content: message.text, createdAt: Date(), selectedChannel: selectedChannel.id })
  }

  const handleOnKeyPress = e => {
    if (e.shiftKey && e.key === 'Enter') {
      // Default Behavior
    } else if (e.key === 'Enter') {
      handleOnSubmit(e);
      setMessage({ text: '' });
    }
  }

  return [message, handleOnChange, handleOnSubmit, handleOnKeyPress]
}

export default useMessageBox;