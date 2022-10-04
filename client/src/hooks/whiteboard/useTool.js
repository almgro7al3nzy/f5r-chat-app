import React, { useContext } from 'react';

import WhiteboardContext from '../../contexts/WhiteboardContext';
import LeftIslandContext from '../../contexts/LeftIslandContext';

const useTool = (id, cursor) => {
  const { setTool, redrawCanvas } = useContext(WhiteboardContext);
  const { setShowLeftIsland } = useContext(LeftIslandContext);

  const handleOnToolSelect = () => {
    redrawCanvas();
    setTool(prevTool => { return { ...prevTool, cursorImg: cursor, name: id } })
    if (id === 'tool-eraser') 
      setTool(prevTool => { return { ...prevTool, lineWidth: 30 } })
    else if (id === 'tool-pencil') {
      setShowLeftIsland(true);
      setTool(prevTool => { return { ...prevTool, lineWidth: 2 } })
    } else if (id === 'tool-pointer')
      setShowLeftIsland(false);
    else if (id === 'tool-text')
      setShowLeftIsland(true);
    else {
      alert('what have you done?');
    }
  }

  return [handleOnToolSelect];
}

export default useTool;