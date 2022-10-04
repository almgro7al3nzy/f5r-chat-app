import React, { useContext } from 'react';

import '../../../styles/SideBar.css';
import AddChannelModal from '../../modals/AddChannelModal';
import useChannelGroup from '../../../hooks/useChannelGroup';
import ChannelContext from '../../../contexts/ChannelContext';


const ChannelGroup = () => {
  const expander = () => <svg width="12" height="12" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M16.59 8.59004L12 13.17L7.41 8.59004L6 10L12 16L18 10L16.59 8.59004Z"></path></svg>
  const [renderChannels, handleOnCollapse] = useChannelGroup();
  const { textChannels, voiceChannels, whiteboardChannels } = useContext(ChannelContext);

  return (
    <div className="all-channels-container">
      {/* Render text channels */}
      <div className="channel-flex" onClick={() => handleOnCollapse('text')} >
        <span>
          <span className="text-channel-title expander">{ expander() }</span>
          <span className="text-channel-title" >TEXT CHANNELS</span>
        </span>
        <AddChannelModal type="text" />
      </div>
      <div className="channel-group-container">
        {renderChannels('text', textChannels)}
      </div>

      {/* Render Whiteboard channels */}
      <div className="channel-flex" onClick={() => handleOnCollapse('whiteboard')} >
        <span>
          <span className="text-channel-title expander">{ expander() }</span>
          <span className="text-channel-title" >Whiteboards</span>
        </span>
        <AddChannelModal type="whiteboard" />
      </div>
      <div className="channel-group-container">
        {renderChannels('whiteboard', whiteboardChannels)}
      </div>

      {/*  Render Voice Channels  */}
      <div className="channel-flex" onClick={() => handleOnCollapse('voice')} >
        <span>
          <span className="text-channel-title expander">{ expander() }</span>
          <span className="text-channel-title" >Voice Channels</span>
        </span>
        <AddChannelModal type="voice" />
      </div>
      <div className="channel-group-container">
        {renderChannels('voice', voiceChannels)}
      </div>
    </div>
  );
};

export default ChannelGroup;