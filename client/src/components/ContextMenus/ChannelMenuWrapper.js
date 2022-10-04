import React from "react";

import { ContextMenu, ContextMenuTrigger } from "react-contextmenu";
import ChannelMenu from './ChannelMenu';
import '../../styles/ContextMenu.css';

 
const ChannelMenuWrapper = ({ channelID, channelName, channelType, children }) => {

  return (
    <div>
      <ContextMenuTrigger id={channelID}>
        { children }
      </ContextMenuTrigger>
 
      <ContextMenu id={channelID}>
        <ChannelMenu channelName={channelName} channelID={channelID} channelType={channelType}  />
      </ContextMenu>
    </div>
  );
}
 
export default ChannelMenuWrapper;