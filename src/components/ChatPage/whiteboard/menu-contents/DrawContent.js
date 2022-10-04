import React, { useContext } from 'react';

import HexInput from '../HexInput';
import WhiteboardContext from '../../../../contexts/WhiteboardContext';

const DrawContent = () => {
  const { color, setColor, onStrokeWidthChange, onStrokeStyleChange} = useContext(WhiteboardContext);

  return (
    <>
      <div className="stroke-label">Stroke</div>
      <HexInput
        id="strokecolor"
        className="hex-color-input"
        // error={hexError}
        value={color}
        autoComplete="off"
        variant="outlined"
        handleOnColorClick={(e, color) => setColor(color)}
        colors={
          ['#000000', '#c92a2a', '#862e9c',
            '#364fc7', '#087f5b', '#0b7285',
            '#FFFF00', '#e67700', '#5f3dc4'
          ]
        }
        // helperText={hexError? 'Must be valid hex.' : ''}
        onChange={e => setColor(e.target.value)}
      />
      <div className="stroke-options">
        {/* stroke width  */}
        <div className="options-header">Stroke Width</div>

        <input
          type="radio" 
          id="d1"
          name="width"
          value="Thin"
          className="stroke-radio" 
        />
        <label onClick={() => onStrokeWidthChange(2)} htmlFor="d1" >
          Thin
        </label>
        <input
          type="radio" 
          id="d2"
          name="width"
          value="Bold"
          className="stroke-radio" 
        />
        <label onClick={() => onStrokeWidthChange(4)} htmlFor="d2" >
          Bold
        </label>
        <input 
          type="radio"
          id="d3"
          name="width" 
          value="Thick" 
          className="stroke-radio" 
        />
        <label onClick={() => onStrokeWidthChange(6)} htmlFor="d3" >
          Thick
        </label>
        {/* Stroke Style */}
        <div className="options-header">Stroke Style</div>
        <input 
          type="radio"
          id="d4"
          name="style"
          value="Solid" 
          className="stroke-radio" 
        />
        <label onClick={() => onStrokeStyleChange('solid')} htmlFor="d4" >
          Solid
        </label>
        <input 
          type="radio"
          id="d5"
          name="style"
          value="Solid" 
          className="stroke-radio" 
        />
        <label onClick={() => onStrokeStyleChange('dashed')} htmlFor="d5" >
          Dashed
        </label>
        <input 
          type="radio"
          id="d6"
          name="style"
          value="Solid" 
          className="stroke-radio" 
        />
        <label onClick={() => onStrokeStyleChange('dotted')} htmlFor="d6" >
          Dotted
        </label>
      </div>
    </>
  );
};

export default DrawContent;