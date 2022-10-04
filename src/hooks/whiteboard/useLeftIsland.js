import React from 'react';

import TextContent from '../../components/ChatPage/whiteboard/menu-contents/TextContent';
import DrawContent from '../../components/ChatPage/whiteboard/menu-contents/DrawContent';


const useLeftIsland = () =>{

  const renderLeftIslandContent = tool => {
    console.log('tool', tool);
    switch (tool.name) {
      case 'tool-pencil':
        return <DrawContent />;
      case 'tool-text':
        return <TextContent />;
      default:
        return alert('what did you do this time?');
    }
  };

  return[renderLeftIslandContent];
};

export default useLeftIsland;