import React from 'react';

const MobileTool = ({ hidden, ...props }) => {

  const isHidden = () => {
    return hidden ? 'hidden' : null;
  }

  return (
    <label className={`mobile-menu-btn ${isHidden()}`} htmlFor={props.id}>
      <input 
        type="radio" 
        name="mobile-tool-radio"
        { ...props }
      />
      <div className="mobile-tool-style"></div>
    </label>
  )
}

export default MobileTool;