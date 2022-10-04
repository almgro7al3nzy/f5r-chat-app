import React, { useState, useContext } from 'react';
import Modal from 'react-modal';

import Typography from "@material-ui/core/Typography";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

import SettingsSidebar from '../modals/settings/SettingsSidebar';
import { Grid } from '@material-ui/core';
import server from '../../apis/server';
import UserContext from '../../contexts/UserContext';
import SocketContext from '../../contexts/SocketContext';
import WhiteboardContext from '../../contexts/WhiteboardContext';

import '../../styles/SettingsModal.css'

 
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
    width                 : '100%',
    padding               : '0',
    height                : '100vh'
  },
  overlay : {
    backgroundColor       : "rgb(0, 0, 0)"
  }
};

const useStyles = makeStyles({
  root: {
    background: '#43B581',
    borderRadius: 3,
    border: 0,
    color: 'white',
    lineHeight: '16px',
    height: 32,
    width: '60px',
    minHeight: '32px',
    minWidth: '60px',
    display: 'block',
    marginLeft: '20px',
    marginTop: '10px',
    "&:hover": {
      backgroundColor: "#43B581"
    },
  },
  label: {
    textTransform: 'capitalize',
    fontFamily: 'whitney-book',
    fontSize: '14px',
    fontWeight: '500',
  },
  textfield: {
    background: '#dcddde',
    width: '100%',
    borderRadius: 3,
    marginBottom: '10px',
  },
  heading: {
    fontWeight: 'bold',
    paddingBottom: '30px',
    paddingRight: '50px',
    paddingTop: '50px',
    fontFamily: 'whitney-book',
    fontSize: '3rem',
    color: 'white',
  },
  cancel: {
    height: '48px',
    padding: '2px 4px',
    color: 'red',
    fontSize: '14px',
    fontFamily: 'whitney-book',
    marginLeft: 'auto',
    border: '1px solid red',
    borderRadius: 3,
    lineHeight: '16px',
    height: 32,
    width: '60px',
    minHeight: '32px',
    minWidth: '60px',
    display: 'block',
    marginTop: '10px',
  },
  textfieldHeading: {
    color: '#8e9297',
    fontSize: '1.2rem',
    fontFamily: 'whitney-book',
    paddingBottom: '5px',
  }
});
 
// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#user-settings-modal')
 
const UserSettingsModal = ({ type }) => {
  const classes = useStyles();
  const { user, setUser } = useContext(UserContext);
  const { removeAllCursors } = useContext(WhiteboardContext);
  const { socket } = useContext(SocketContext);
  const [form, setForm] = useState({ 
    photo: null, 
    displayName: user.displayName, 
    email: user.email, 
    currentPassword: '', 
    password: '' 
  });
  const [isEdit, setIsEdit] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [pfp, setpfp] = useState(user.photoURL);

  const settingsIcon = <svg aria-hidden="false" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M19.738 10H22V14H19.739C19.498 14.931 19.1 15.798 18.565 16.564L20 18L18 20L16.565 18.564C15.797 19.099 14.932 19.498 14 19.738V22H10V19.738C9.069 19.498 8.203 19.099 7.436 18.564L6 20L4 18L5.436 16.564C4.901 15.799 4.502 14.932 4.262 14H2V10H4.262C4.502 9.068 4.9 8.202 5.436 7.436L4 6L6 4L7.436 5.436C8.202 4.9 9.068 4.502 10 4.262V2H14V4.261C14.932 4.502 15.797 4.9 16.565 5.435L18 3.999L20 5.999L18.564 7.436C19.099 8.202 19.498 9.069 19.738 10ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"></path></svg>;
  const escIcon = <i class="far fa-times-circle fa-2x"></i>;

  const openModal = e => {
    e.stopPropagation();
    setIsOpen(true)
  };

  const handleOnChange = e => {
    setForm({ ...form, [e.target.id]: e.target.value });
  }

  const handleOnSubmit = e => {
    e.preventDefault();
    const formData = new FormData();
    if (form.photo) formData.append('photo', form.photo);
    formData.append('displayName', form.displayName);
    formData.append('email', form.email);
    formData.append('currentPassword', form.currentPassword);
    formData.append('password', form.password);

    server.put('/user/', formData)
      .then(result =>  {
        setUser(prevUser => { return { ...prevUser, ...result.data } });
        socket.emit('refresh users');
        setIsEdit(false);
      })
      .catch(error => console.log('failed update', error.response));
  }
 
  const closeModal = () => {
    setIsOpen(false);
  }

  const handleUploaderChange = () => {
    const photo = document.querySelector('.avatar-uploader');
    setpfp(URL.createObjectURL(photo.files[0]));
    setForm({ ...form, photo: photo.files[0] });
  }

  const renderProfileInfo = () => {
    return(
      <div className="profile-info-container">
        <img className="settings-modal-avatar" src={pfp} />
        <div className="settings-modal-info">
          <div className="settings-modal-subtitle">USERNAME</div>
          <div className="settings-modal-subtitle-content">{user.displayName}</div>
          <br></br>
          <div className="settings-modal-subtitle">EMAIL</div>
          <div className="settings-modal-subtitle-content">{user.email}</div>
        </div>
        <button className="settings-modal-edit" onClick={() => setIsEdit(true)}>Edit</button>
      </div>
    )
  }

  const renderChangePassword = () => {
    if(changePassword) 
      return(
        <>
          <Typography classes= {{root: classes.textfieldHeading}}>
            New Password
          </Typography>
          <TextField 
              required
              id="password"
              classes={{ root: classes.textfield}}
              value={form.password}
              autoComplete="off"
              type="password"
              variant="outlined"
              onChange={(event) => handleOnChange(event)}
            />
        </>
      );
    else{
      return(
        <div 
          className="change-password"
          onClick={() => setChangePassword(true)}
        >
          Change Password?
        </div>
      )
    }
  };

  const renderProfileEdit = () => {
    if (isEdit) {
      return (
      <form className="profile-info-container" onSubmit={handleOnSubmit}>
        <input onChange={handleUploaderChange} className="avatar-uploader" type="file" name="photo" style={{ display: "none" }} />
        <div className="avatar-edit-container" onClick={() => document.querySelector(".avatar-uploader").click()}>
          <img className="settings-modal-avatar" src={pfp} />
        </div>
        <div className="settings-modal-info">
          <Typography classes= {{root: classes.textfieldHeading}}>
            UserName
          </Typography>
          <TextField 
              required
              id="displayName"
              classes={{ root: classes.textfield}}
              value={form.displayName}
              autoComplete="off"
              type="text"
              variant="outlined"
              onChange={(event) => handleOnChange(event)}
          />
          <Typography classes= {{root: classes.textfieldHeading}}>
            Email
          </Typography>
          <TextField 
              required
              id="email"
              classes={{ root: classes.textfield}}
              value={form.email}
              autoComplete="off"
              type="email"
              variant="outlined"
              onChange={(event) => handleOnChange(event)}
            />
          <Typography classes= {{root: classes.textfieldHeading}}>
            Current Password
          </Typography>
          <TextField 
              required
              id="currentPassword"
              classes={{ root: classes.textfield}}
              // value={form.currentPassword}
              autoComplete="off"
              type="password"
              variant="outlined"
              onChange={(event) => handleOnChange(event)}
          />
          {renderChangePassword()}
          <div className="button-container">
            <Button
              classes={{
                root: classes.cancel,
                label: classes.label,
              }}
              onClick = {() => {
                setIsEdit(false);
                setChangePassword(false);
                setpfp(user.photoURL);
              }}
            >
              cancel
            </Button>
            <Button 
              classes={{
                root: classes.root,
                label: classes.label,
              }}
              onClick = {(event) => {handleOnSubmit(event)}}
              >
                Submit
            </Button>
          </div>
        </div>
        {/* <button>Submit</button> */}
      </form>        
      )
    } else {
      return (renderProfileInfo())
    }
  }

  return (
    <>
      <span className="settings-button" onClick={openModal}>{settingsIcon}</span>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="settings-modal-content">
          <Grid className="settings-modal-grid" container spacing={0}>
            <Grid className="settings-modal-grid" item sm={4} md={2}>
              <SettingsSidebar/>
            </Grid>
            <Grid className="right-grid" item sm={8} md={10}>
              <div className="setting-main">
                <h2 className="user-modal-title">MY ACCOUNT</h2>
                {renderProfileEdit()}
                {/* <div className="two-factor-container">
                  <h2>
                    Two Factor Authentication
                  </h2>
                </div> */}
              </div>

              <div className="setting-fixed-container">
                  <div className="setting-exit" onClick={closeModal}>
                    {escIcon}
                    <div className="exit-text">
                      ESC
                    </div>
                  </div>
              </div>
            </Grid>
          </Grid>
        </div>
      </Modal>
    </>
  );
}
 
export default UserSettingsModal;