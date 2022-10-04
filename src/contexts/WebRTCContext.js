import React, { useRef } from 'react';

const WebRTCContext = React.createContext();

export const WebRTCProvider = ({ children }) => {
  let myStream = null;
  let connections = {}; // socketId -> RTCPeerConnection

  const config = { 
    "iceServers": [
      { "url": "stun:stun.1.google.com:19302" }, 
      { "url": "turn:54.90.251.22:3478", "username": "borg", "credential": "123" }
    ]
  };

  const onIceCandidateHandler = (event, data, sendIce) => {
    if (event.candidate) {
      sendIce();
    } else {      
      console.log('All ice candidates have been sent.');
    }
  };

  const onTrackHandler = (event, data) => {
    if (!document.getElementById(`${data.socketId}`)) {
      const audioElement = document.createElement("AUDIO");
      audioElement.setAttribute("autoplay", "autoplay");
      audioElement.setAttribute("id", data.socketId);
      document.body.appendChild(audioElement);
      if (document.getElementById(`${data.socketId}`).srcObject !== event.streams[0]) {
        document.getElementById(`${data.socketId}`).srcObject = event.streams[0];
      }
   }
  };
  
  const getMedia = (constraints, callback) => {
    console.log('inside of promise')
    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        /* use the stream */
        myStream = stream;
        callback();
      })
      .catch((err) => {
        /* handle the error */
        console.log('failed to get media', err);
      });
  }

  const openCall = (myPeerConnection, socket, targetSocketId, channelName) => {
    for (const track of myStream.getTracks()) {
      myPeerConnection.addTrack(track, myStream);
    }

    sendOffer(myPeerConnection, socket, targetSocketId, channelName);
  }
  
  const sendOffer = (myPeerConnection, socket, targetSocketId, channelName) => {
    connections[targetSocketId] = myPeerConnection;
    myPeerConnection.createOffer({   offerToReceiveAudio: 1,
      offerToReceiveVideo: 0,
      voiceActivityDetection: false })
      .then(offer => myPeerConnection.setLocalDescription(new RTCSessionDescription(offer)))
      .then(() => {
        console.log('Sending offer to callee.');
        socket.emit('send offer', { sdp: myPeerConnection.localDescription, targetSocketId, channelName })
      })
      .catch(function(reason) {
        // An error occurred, so handle the failure to connect
        console.log('Failed to send offer.');
      });
  }

  const acceptOffer = (myPeerConnection, description, socket, targetSocketId) => {
    connections[targetSocketId] = myPeerConnection;
    
    for (const track of myStream.getTracks()) {
      myPeerConnection.addTrack(track, myStream);
    }

    myPeerConnection.setRemoteDescription(new RTCSessionDescription(description))
      .then(() => {
        myPeerConnection.createAnswer().then(answer => {
          return myPeerConnection.setLocalDescription(new RTCSessionDescription(answer));
        })
        .then(() => {
          console.log('Sending answer to caller.')
          socket.emit('send answer', { sdp: myPeerConnection.localDescription, targetSocketId })
        })
        .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }

  const acceptAnswer = (targetSocketId, description) => {
    const myPeerConnection = connections[targetSocketId];
    
    myPeerConnection.setRemoteDescription(new RTCSessionDescription(description));

    console.log('Accepted Answer', myPeerConnection);
  }

  const addIce = (targetSocketId, ice) => {
    const pc = connections[targetSocketId];
    if (ice && pc) {
      pc.addIceCandidate(ice)
        .then(() => {
          console.log('Successfully added ice candidiates.');
        })
        .catch(e => {
          console.log('Failure to add ice candidiate:', e.name);
        });
    } else {
      // handle other things you might be signaling, like sdp
    }
  }

  const leaveVoice = () => {
    for (const track of myStream.getTracks()) {
      track.stop();
    }

    for (let key in connections) {
      connections[key].close();
    }

    document.querySelectorAll('audio').forEach(node => node.remove());

    connections = {};
  }

  const closeConnection = leaver => {
    connections[leaver].close();
    delete connections[leaver];
  }

  const toggleMute = () => {
    myStream.getTracks()[0].enabled = !myStream.getTracks()[0].enabled;
  }

  return (
    <WebRTCContext.Provider value={{ 
      getMedia, 
      openCall, 
      sendOffer, 
      acceptOffer, 
      acceptAnswer, 
      addIce, 
      config, 
      onIceCandidateHandler,
      onTrackHandler,
      leaveVoice,
      closeConnection,
      toggleMute
    }}>
      { children }
    </WebRTCContext.Provider>
  )
}

export default WebRTCContext;