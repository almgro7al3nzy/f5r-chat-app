import React, { useContext } from 'react';

import LeftIslandContext from '../../../contexts/LeftIslandContext';
import useLeftIsland from '../../../hooks/whiteboard/useLeftIsland';
import WhiteboardContext from '../../../contexts/WhiteboardContext';

const LeftIsland = () => {
  const { showLeftIsland } = useContext(LeftIslandContext);
  const { tool } = useContext(WhiteboardContext);
  const [renderLeftIslandContent] = useLeftIsland();

  return showLeftIsland && (
    <div className="left-island">
      {/* <DrawContent /> */}
      { renderLeftIslandContent(tool) }
    </div>
  )
}

export default LeftIsland;