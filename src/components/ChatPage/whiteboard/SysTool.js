import React from 'react';

const SysTool = ({ children, name, id, handleOnClick }) =>{

  return(
    <label className="systool">
      <input type="radio" name={name} id={id} onClick={handleOnClick} />
      <div>
        { children }
      </div>

    </label>
  )
}

export default SysTool;