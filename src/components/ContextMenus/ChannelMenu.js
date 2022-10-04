import React, { useContext } from 'react';
import { MenuItem } from 'react-contextmenu';
import server from '../../apis/server';
import SocketContext from '../../contexts/SocketContext';


const ChannelMenu = ({ channelID, channelType }) => {

  const { socket } =  useContext(SocketContext);

  const handleDelete = () =>{
    server.delete(`/${channelType}/delete/${channelID}`)
      .then(res => socket.emit(`delete ${channelType} channel`, res.data));
  }

  const deleteOption = () => {
    return(
      <MenuItem onClick={handleDelete}>
        Delete
      </MenuItem>
    )
  };



  return (
    <>
    {deleteOption()}
    </>
  )
};

export default ChannelMenu;