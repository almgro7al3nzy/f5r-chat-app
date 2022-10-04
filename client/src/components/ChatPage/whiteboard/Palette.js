import React, { useEffect, useRef } from 'react';

const Palette = ({ showPalette, handleClosePalette, handleOnColorClick, colors }) => {
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = e => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        handleClosePalette();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const renderColors = () => {
    return colors.map(color => 
      <div 
        onClick ={e => handleOnColorClick(e, color.slice(1))} 
        className="palette-color" 
        style={{ background: color }} 
      />
    );
  };

  const renderPalette = () => {
    return showPalette && (
      <div ref={wrapperRef} className="palette-grid">
        { renderColors() }
      </div>
    );
  };

  return renderPalette();
};

export default Palette;