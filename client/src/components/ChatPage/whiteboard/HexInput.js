import React, { useState } from 'react';

import TextField from '@material-ui/core/TextField';
import Palette from './Palette';

const HexInput = props => {
  const [showPalette, setShowPalette] = useState(false);

  const handleOnSelectorClick = () => {
    setShowPalette(prevState => !prevState);
  }

  const handleClosePalette = () => {
    setShowPalette(false);
  }

  return (
    <div className="hex-wrapper">
      <div className="hex-selector" onClick={handleOnSelectorClick} style={{ background: '#' + props.value }}>
        <Palette 
          handleOnColorClick={props.handleOnColorClick}
          showPalette={showPalette} 
          handleClosePalette={handleClosePalette}
          colors={props.colors}
        />
      </div>
      <div className="hex-input-container">
        <div className="hex-symbol">#</div>
        <TextField { ...props }></TextField>
      </div>
    </div>
  );
};

export default HexInput;