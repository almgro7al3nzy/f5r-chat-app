import React, { useState } from 'react';

import MobileSlideup from './MobileSlideup';
import MobileTool from './MobileTool';
import DrawContent from './menu-contents/DrawContent';
import MiscContent from './menu-contents/MiscContent';

const MobileMenu = () => {
  const [selected, setSelected] = useState('');

  const isChecked = value => {
    return selected === value;
  }

  const handleOnClick = e => {
    // De-selects menu on second click.
    const value = e.target.value === selected? '' : e.target.value;
    setSelected(value);
  }

  const renderContent = () => {
    switch (selected) {
      case 'misc':
        return <MiscContent />;
      case 'paint':
        return <DrawContent />;
      default:
        return null;
    }
  }

  return (
    <div className="mobile-menu-container">
      <MobileSlideup>{renderContent()}</MobileSlideup>
      <MobileTool 
        id="mobile-misc-menu" 
        value="misc" 
        checked={isChecked('misc')}
        onClick={handleOnClick}
      />
      <MobileTool 
        id="mobile-paint-menu" 
        value="paint" 
        checked={isChecked('paint')} 
        onClick={handleOnClick}
      />
      <MobileTool id="mobile-0-menu" hidden />
      <MobileTool id="mobile-1-menu" hidden />
      <MobileTool id="mobile-2-menu" hidden />
      <MobileTool id="mobile-3-menu" hidden />
    </div>
  );
};

export default MobileMenu;