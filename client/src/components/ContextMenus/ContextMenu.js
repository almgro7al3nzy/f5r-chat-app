import React from "react";

import { ContextMenu, ContextMenuTrigger } from "react-contextmenu";
import VoiceMenu from './VoiceMenu';
import '../../styles/ContextMenu.css';

 
const ContextMenuWrapper = ({ talker, children, muted, setMuted }) => {
  const collect = () => {
    return { talker }
  }

  return (
    <div>
      <ContextMenuTrigger collect={collect} id={talker.socketId}>
        { children }
      </ContextMenuTrigger>
 
      <ContextMenu id={talker.socketId}>
        <VoiceMenu talker={talker} muted={muted} setMuted={setMuted} />
      </ContextMenu>
    </div>
  );
}
 
export default ContextMenuWrapper;