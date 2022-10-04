import React, { useEffect, useContext, useState } from 'react';
import ChannelContext from '../contexts/ChannelContext'
import SocketContext from '../contexts/SocketContext';
import server from '../apis/server';
import WebRTCContext from '../contexts/WebRTCContext';
import Talker from '../components/ChatPage/sidebar/Talkers';
import BrushIcon from '@material-ui/icons/Brush';
import WhiteboardContext from '../contexts/WhiteboardContext';
import ChannelMenuWrapper from '../components/ContextMenus/ChannelMenuWrapper';
import LogsContext from '../contexts/LogsContext';


const useChannelGroup = () => {
  const [channelGroupsCollapse, setChannelGroupsCollapse] = useState({ text: false, voice: false });

  const { setBgColor, removeAllCursors, appendCursor, leaveWhiteboard, shapesRef, redrawCanvas } = useContext(WhiteboardContext);
  const { socket } = useContext(SocketContext);
  const { messageMapRef, setLogs } = useContext(LogsContext);
  const { getMedia, leaveVoice } = useContext(WebRTCContext);
  const { 
    whiteboardChannels,
    setSelectedChannel, 
    selectedChannel, 
    talkers, 
    setSelectedVoice,
    selectedVoice
  } = useContext(ChannelContext);

  const onErrorClose = () => {
    const error = document.querySelector('.error-message-container');
    if (error) error.remove();
  }

  const onServerFailure = ({ response }) => {
    onErrorClose();
    const status = response.status;
    const message = response.data;
    const messageContainer = document.createElement('div');
    const messageText = document.createElement('p');
    const closeButton = document.createElement('div');
    messageContainer.setAttribute('class', 'error-message-container');
    messageText.setAttribute('class', 'error-message-text');
    closeButton.setAttribute('class', 'error-close-button');
    messageText.innerHTML = `Server Failure (${status}): ${message}`;
    closeButton.innerHTML = 'X';
    messageContainer.appendChild(messageText);
    messageContainer.appendChild(closeButton);
    document.querySelector('.message-ui').appendChild(messageContainer);
    closeButton.addEventListener('click', onErrorClose);
  }

  const onJoinVoiceSuccess = channelName => {
    if (selectedVoice) leaveVoice();
    getMedia({ audio: true }, () => {
      console.log('get media')
      socket.emit('joined voice', { channelName, socketId: socket.id });
      setSelectedVoice(channelName);    
    })          
  };

  const onJoinWhiteboardSuccess = (channelName, removeAllCursors) => { 
    socket.emit('join whiteboard',  { channelName });
    removeAllCursors();
    onErrorClose();
    if (whiteboardChannels.find(w => w.name === channelName).artists.length === 0) {
      server.get('/whiteboard/load', { params: { name: channelName } })
        .then(response => {
          setBgColor(response.data.bgColor.slice(1));
          const canvas = document.querySelector('canvas');
          // const context = canvas.getContext('2d');
          // const dataURL = response.data.img;
          // const img = new Image();
          canvas.style.background = response.data.bgColor;
          // img.onload = () => context.drawImage(img, 0, 0);
          // img.src = dataURL;
          shapesRef.current = response.data.shapes;
          redrawCanvas();
        })
        .catch(e => console.log(e));
    }
      
    whiteboardChannels.find(w => w.name === channelName).artists.forEach(a => {
      if (!document.getElementById(`cursor-${a.socketId}`) && socket.id !== a.socketId)
        appendCursor(a);
    });
  };
  
  const handleOnClick = (e, type, channelName, channelId) => {
    switch(type) {
      case 'voice':
        return server.put('/voice/join-voice', ({ socketId: socket.id, channelName }))
          .then(() => onJoinVoiceSuccess(channelName))
          .catch(onServerFailure);
      case 'whiteboard':
        // Join from another whiteboard channel.
        if (selectedChannel.type === 'whiteboard' && channelName !== selectedChannel.name) {
          leaveWhiteboard(socket, selectedChannel);
        }

        server.put('/whiteboard/join', { name: channelName })
          .then(() => onJoinWhiteboardSuccess(channelName, removeAllCursors))
          .catch(onServerFailure);
        break;
      case 'text':
        if (selectedChannel.type === 'whiteboard')
          leaveWhiteboard(socket, selectedChannel);

        setLogs(messageMapRef.current[channelId]);
        break;
      default:
        return;
    }

    document.querySelectorAll('input[type="radio"]').forEach(e => {
      if (e.name !== `${type}-radio`) e.checked = false;
    });

    setSelectedChannel({ name: e.target.value, type: type, id: channelId });
  };

  const handleOnCollapse = type => {
    setChannelGroupsCollapse(prev => { return { ...prev, [type]: !prev[type] } });
  }

  const renderTalkers = channelName => {
    if(!talkers[channelName]) return null;

    return talkers[channelName].map(t => <Talker t={t} />)
  }

  const isSame = (c1, c2) => c1 === c2? 'block' : 'none';

  const renderChannelIcon = type => {
    switch(type) {
      case 'text':
        return <svg width="20" height="20" viewBox="0 0 24 24" class="channel-symbol"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M5.88657 21C5.57547 21 5.3399 20.7189 5.39427 20.4126L6.00001 17H2.59511C2.28449 17 2.04905 16.7198 2.10259 16.4138L2.27759 15.4138C2.31946 15.1746 2.52722 15 2.77011 15H6.35001L7.41001 9H4.00511C3.69449 9 3.45905 8.71977 3.51259 8.41381L3.68759 7.41381C3.72946 7.17456 3.93722 7 4.18011 7H7.76001L8.39677 3.41262C8.43914 3.17391 8.64664 3 8.88907 3H9.87344C10.1845 3 10.4201 3.28107 10.3657 3.58738L9.76001 7H15.76L16.3968 3.41262C16.4391 3.17391 16.6466 3 16.8891 3H17.8734C18.1845 3 18.4201 3.28107 18.3657 3.58738L17.76 7H21.1649C21.4755 7 21.711 7.28023 21.6574 7.58619L21.4824 8.58619C21.4406 8.82544 21.2328 9 20.9899 9H17.41L16.35 15H19.7549C20.0655 15 20.301 15.2802 20.2474 15.5862L20.0724 16.5862C20.0306 16.8254 19.8228 17 19.5799 17H16L15.3632 20.5874C15.3209 20.8261 15.1134 21 14.8709 21H13.8866C13.5755 21 13.3399 20.7189 13.3943 20.4126L14 17H8.00001L7.36325 20.5874C7.32088 20.8261 7.11337 21 6.87094 21H5.88657ZM9.41045 9L8.35045 15H14.3504L15.4104 9H9.41045Z"></path></svg>
      case 'voice':
        return <svg class="channel-symbol" aria-hidden="false" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M11.383 3.07904C11.009 2.92504 10.579 3.01004 10.293 3.29604L6 8.00204H3C2.45 8.00204 2 8.45304 2 9.00204V15.002C2 15.552 2.45 16.002 3 16.002H6L10.293 20.71C10.579 20.996 11.009 21.082 11.383 20.927C11.757 20.772 12 20.407 12 20.002V4.00204C12 3.59904 11.757 3.23204 11.383 3.07904ZM14 5.00195V7.00195C16.757 7.00195 19 9.24595 19 12.002C19 14.759 16.757 17.002 14 17.002V19.002C17.86 19.002 21 15.863 21 12.002C21 8.14295 17.86 5.00195 14 5.00195ZM14 9.00195C15.654 9.00195 17 10.349 17 12.002C17 13.657 15.654 15.002 14 15.002V13.002C14.551 13.002 15 12.553 15 12.002C15 11.451 14.551 11.002 14 11.002V9.00195Z"></path></svg>
      case 'whiteboard':
        return <BrushIcon />
     }
  }

  // Preview of artists inside whiteboard.
  const renderArtistIcons = ( channelName, channelType ) => {
    return channelType === 'whiteboard' && whiteboardChannels.length && 
      <div className="artists-icon-container">
        {
          whiteboardChannels.find(w => w.name === channelName).artists.map((a, i) => {
            return (
              <img 
                className="artist-icon" 
                src={a.photoURL} 
                style={{ position: "absolute", right: "10px", transform: `translate(${-(50 * i)}%, -50%)` }} 
              />
            );
          })
      }
    </div>
  }

  const renderChannels = (type, channels) => {
    console.log(channels);
    return channels.map((ch, i) => {
      return (
        <ChannelMenuWrapper channelID={ch._id} channelName={ch.name} channelType={type}>
          <div style={{ display: !channelGroupsCollapse[type]? 'block' : isSame(ch.name, selectedChannel.name) }}>
            <input 
              defaultChecked={i === 0 && type ==='text' } 
              type="radio" 
              id={`${type}-${i}`} 
              name={`${type}-radio`} 
              className={type === 'voice'? 'voice-radio' : 'channel-radio'}
              value={ch.name} 
              onClick={e => handleOnClick(e, type, ch.name, ch._id)} 
            />
            <label htmlFor={`${type}-${i}`}>
              { renderChannelIcon(type) }
              <div>{ch.name}</div>
              { renderArtistIcons(ch.name, type) || null }
            </label>
            { type === 'voice' && talkers[ch.name] &&
              <div className="talkers-container">
                { renderTalkers(ch.name) }
              </div>
            }
          </div>
        </ChannelMenuWrapper>
      )
    })
  }


  return [renderChannels, handleOnCollapse];
}


export default useChannelGroup;