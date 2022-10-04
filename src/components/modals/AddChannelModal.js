import TextField from '@material-ui/core/TextField';
import React, { useState, useContext } from 'react';
import Modal from 'react-modal';
import server from '../../apis/server';
import SocketContext from '../../contexts/SocketContext';

 
const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    backgroundColor       : '#36393f',
    border                : 'none',
    width                 : '440px',
    padding               : '0'
  },
  overlay : {
    backgroundColor       : "rgb(0, 0, 0)"
  }
};
 
// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#add-channel-modal')
 
const AddChannelModal = ({ type }) => {
  const { socket } = useContext(SocketContext);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [channelName, setChannelName] = useState('');

  const plus = () => <svg aria-hidden="false" width="18" height="18" viewBox="0 0 18 18"><polygon fill-rule="nonzero" fill="currentColor" points="15 10 10 10 10 15 8 15 8 10 3 10 3 8 8 8 8 3 10 3 10 8 15 8"></polygon></svg>

  const openModal = e => {
    e.stopPropagation();
    setIsOpen(true)
  };
 
  const closeModal = () => setIsOpen(false);

  const handleOnSubmit = () => {
    server.post(`/${type}`, { name: channelName })
      .then(res => {
        socket.emit(`create ${type} channel`, res.data);
        closeModal()
      })
      .catch(error => console.log(error));

  }

  const handleOnChange = e => setChannelName(e.target.value);
 
  return (
    <>
      <span className="plus" onClick={openModal}>{plus()}</span>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="modal-content">
          <div className="create-title">CREATE TEXT CHANNEL</div>
          <div className="channel-textbox-label">CHANNEL NAME</div>
          <TextField className="channel-textbox" variant="outlined" onChange={handleOnChange} />
        </div>
        <div className="modal-footer">
          <button className="modal-button-cancel" onClick={closeModal}>Cancel</button>
          <button className="modal-button-create" onClick={handleOnSubmit}>Create Channel</button>
        </div>
      </Modal>
    </>
  );
}
 
export default AddChannelModal;