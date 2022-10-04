import React from 'react';

import ToolKit from './ToolKit';
import Tool from './Tool';

const ToolBox = () =>{
  return(
    <div className="tool-box">
      <Tool name="tool" id="tool-pointer" cursor={ToolKit.POINTER_ICON}>{ToolKit.POINTER}</Tool>
      <Tool name="tool" id="tool-pencil" cursor={ToolKit.PENCIL_ICON}>{ToolKit.PENCIL}</Tool>
      <Tool name="tool" id="tool-text" cursor="text">{ToolKit.TEXT}</Tool>

      {/* <Tool name="tool" id="tool-eraser" cursor={ToolKit.ERASER_ICON}>{ToolKit.ERASER}</Tool> */}
    </div>
  )
}

export default ToolBox;