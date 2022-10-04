import React, { useContext } from 'react';
import WhiteboardContext from '../../../../contexts/WhiteboardContext';
import HexInput from '../HexInput';


const TextContent = () => {

  const { color, setColor, changeFontSize } = useContext(WhiteboardContext);

  return(
  <>
    <div className="stroke-label">Text Style</div>
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
    <div className="text-options">

      <div className="options-header">Font Size</div>
      <input  
        type="radio"
        id="t1"
        name="size"
        value="Small"
        className="stroke-radio" 
      />
      <label onClick={() => changeFontSize(20)} htmlFor="t1" >
        Small
      </label>
      <input  
        type="radio" 
        id="t2"
        name="size"
        value="Medium"
        className="stroke-radio" 
      />
      <label onClick={() => changeFontSize(26)} htmlFor="t2" >
        Medium 
      </label>
      <input  
        type="radio"
        id="t3"
        name="size"
        value="Large"
        className="stroke-radio" 
      />
      <label onClick={() => changeFontSize(32)} htmlFor="t3" >
        Large
      </label>

      <div className="options-header">Font Family</div>
      <input  
        type="radio"
        id="t4"
        name="family"
        value="Classic"
        className="stroke-radio" 
      />
      <label onClick={() => console.log('kjfndsk')} htmlFor="t4" >
        Classic
      </label>
    </div>
  </>
  )
};

export default TextContent;