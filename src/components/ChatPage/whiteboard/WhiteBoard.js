import React from 'react';

import '../../../styles/Whiteboard.css';
import useWhiteboard from '../../../hooks/useWhiteboard';
import ToolBox from './ToolBox';
import Island from './Island';
import LeftIsland from './LeftIsland';
import MobileMenu from './MobileMenu';

const WhiteBoard = () => {
  const [handleOnMouseDown, handleOnMouseUp, handleOnMouseMove, renderActiveArtists, throttle] = useWhiteboard();

  return (
    <div className="whiteboard-canvas" onScroll={() => {
      const drawUI = document.querySelector('.draw-ui');
      const whiteboardCanvas = document.querySelector('.whiteboard-canvas');
      const activeArtists = document.querySelector('.active-artists');
      const mobileMenu = document.querySelector('.mobile-menu-container');
      
      drawUI.style.top = `${whiteboardCanvas.scrollTop}px`;
      drawUI.style.left = `${whiteboardCanvas.scrollLeft}px`;
      activeArtists.style.bottom = -whiteboardCanvas.scrollTop + 'px';
      activeArtists.style.left = whiteboardCanvas.scrollLeft + (whiteboardCanvas.clientWidth / 2) - (activeArtists.clientWidth / 2) + 'px';
      activeArtists.style.transform = 'none';
      mobileMenu.style.top = `${whiteboardCanvas.scrollTop + whiteboardCanvas.clientHeight - mobileMenu.clientHeight - 8}px`;
    }}>

      <div className="row draw-ui" >
        <div className="col-4">
          <div className="row island-row">
            <div className="col-12">
              <Island />
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <LeftIsland />
            </div>
          </div>
        </div>
        <div className="col-4 center">
          <ToolBox />
        </div>
        <div className="col-4"></div>
      </div>
      
      <canvas 
        id="whiteboard"
        onMouseDown={throttle(handleOnMouseDown, 20)}
        onMouseMove={throttle(handleOnMouseMove, 20)}
        onMouseUp={throttle(handleOnMouseUp, 20)}
        onMouseOut={throttle(handleOnMouseUp, 20)}
        width="7680"
        height="4320"
      >
      </canvas>

      <MobileMenu />

      <div className="active-artists">
        {renderActiveArtists()}
      </div>
    </div>
  ) 
};

export default WhiteBoard;