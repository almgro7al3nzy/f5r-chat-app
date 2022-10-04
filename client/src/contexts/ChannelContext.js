import React, { useState, useRef } from 'react';

import server from '../apis/server';
import { MESSAGE_LIMIT } from '../configs';

const ChannelContext = React.createContext();

export default ChannelContext;

export const ChannelProvider = ({ children }) => {
  const [channels, setChannels] = useState([]);
  const [textChannels, setTextChannels] = useState([]);
  const [voiceChannels, setVoiceChannels] = useState([]);
  const [whiteboardChannels, setWhiteboardChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState({ name: '', type: '', id: '' });
  const [selectedVoice, setSelectedVoice] = useState('');
  const [talkers, setTalkers] = useState({});
  const channelCoordinatesRef = useRef();
  const selectedChannelRef = useRef();

  // const populateChannelCoords = {};
  // for( let channel of textChannels) {
  //   if(!populateChannelCoords.hasOwnProperty(channel.name)) populateChannelCoords[channel.name] = Infinity; 
  // }
  // channelCoordinatesRef.current = populateChannelCoords;
  // console.log(channelCoordinatesRef.current)

  selectedChannelRef.current = selectedChannel;

  const fetchTextChannels = fetchAllMessages => {
    server.get('/text')
      .then(response => {
        setTextChannels(response.data);
        setSelectedChannel({ name: response.data[0].name, type: 'text', id: response.data[0]._id }); //always assume we have at least one text channel left
        fetchAllMessages(response.data, MESSAGE_LIMIT);
      })
      .catch(err => console.log(err));
  };
  
  //when creating or deleting channels
  const fetchTextChannel = channelID =>{
    server.get(`/text/${channelID}`)
    .then(response => {
      setTextChannels(prevTextChannels => [...prevTextChannels, response.data]);
    });
  };

  const fetchVoiceChannels = () => {
    server.get('/voice')
      .then(response => {
        setVoiceChannels(response.data);
        let newTalkers = {};

        for (let ch of response.data) {
          for (let key in ch.talkers) {
            newTalkers[ch.name] = !newTalkers[ch.name]
            ? [JSON.parse(ch.talkers[key])] 
            : [...newTalkers[ch.name], JSON.parse(ch.talkers[key])];
          }
        }
        setTalkers(newTalkers);
      })
      .catch(err => console.log(err));
  };

  const fetchWhiteboardChannels = () => {
    server.get('/whiteboard')
      .then(response => {
        setWhiteboardChannels(response.data);
      })
      .catch(err => console.log(err));
  };


  return(
    <ChannelContext.Provider value={{ 
      channels,
      setChannels,
      selectedChannel,
      setSelectedChannel,
      setWhiteboardChannels,
      talkers,
      setTalkers,
      selectedVoice,
      setSelectedVoice,
      fetchTextChannels,
      fetchTextChannel,
      textChannels,
      setTextChannels,
      voiceChannels,
      setVoiceChannels,
      fetchVoiceChannels,
      fetchWhiteboardChannels,
      whiteboardChannels,
      selectedChannelRef
    }}>
      { children }
    </ChannelContext.Provider>
  )

}