import React from 'react';

import useTool from '../../../hooks/whiteboard/useTool';

const Tool = ({ children, name, id, cursor }) =>{
  const [handleOnToolSelect] = useTool(id, cursor);

  return(
    <label className="tool-icons">
      <input 
        className="radio-tools" 
        type="radio" 
        name={name} 
        id={id} 
        onClick={handleOnToolSelect} 
      />
      <div>
        { children }
      </div>

    </label>
  )
}

export default Tool;