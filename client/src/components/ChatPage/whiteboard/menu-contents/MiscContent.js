import React, { useContext, useState } from 'react';
import SocketContext from '../../../../contexts/SocketContext';
import ChannelContext from '../../../../contexts/ChannelContext';
import WhiteboardContext from '../../../../contexts/WhiteboardContext';
import ToolKit from '../ToolKit';
import SysTool from '../SysTool';
import HexInput from '../HexInput';

const MiscContent = () => {
  const { socket } = useContext(SocketContext);
  const { selectedChannel } = useContext(ChannelContext);
  const { bgColor, setBgColor, hexError, setHexError } = useContext(WhiteboardContext);
  const [show, setShow] = useState(true);

  const toggleShow = () => setShow(!show);

  const handleOnClear = () =>{
    if(window.confirm('This will clear the whole canvas. Are you sure?'))
      socket.emit('clear canvas', {channelName: selectedChannel.name});
  }
  const handleOnSubmit = (e, color) => {
    e.preventDefault();
    if (!/^#[0-9A-F]{6}$/i.test('#' + color)) return setHexError(true);
    if (window.confirm('This will clear the whole canvas. Are you sure?')) {
      socket.emit('canvas background change', { color, channelName: selectedChannel.name });      
    }
  };

  const HideButton = () => {
    return <div className="hide-island-button" onClick={toggleShow}><i class="fas fa-compress-alt"></i></div>;
  };

  return show? (
    <>
      <div className="row">
        <div className="col-12">
          <div className="misccontent-tool-container">
            <div className="systool-container">
              <SysTool name="systool" id="island-delete" handleOnClick={handleOnClear}>{ToolKit.DELETE}</SysTool>
              <SysTool name="systool" id="island-save">{ToolKit.SAVE}</SysTool>
            </div>
            <HideButton />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <form onSubmit={e => handleOnSubmit(e, bgColor)}>
            <HexInput
              id="bgcolor"
              className="hex-color-input"
              error={hexError}
              value={bgColor}
              autoComplete="off"
              variant="outlined"
              handleOnColorClick={handleOnSubmit}
              helperText={hexError ? 'Must be valid hex.' : ''}
              colors={
                ['#ffffff', '#fff4e6', '#fff9db',
                  '#f4fce3', '#ebfbee', '#e6fcf5',
                  '#edf2ff', '#f8f0fc', '#e3fafc'
                ]
              }
              onChange={e => setBgColor(e.target.value)}
            />
          </form>
        </div>
      </div>
    </>
  ) : <HideButton />
}

export default MiscContent;