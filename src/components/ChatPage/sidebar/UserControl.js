import  React, { useContext } from 'react';

import useUserControl from '../../../hooks/useUserControl';
import UserContext from '../../../contexts/UserContext';
import UserSettingModal from '../../modals/UserSettingsModal';

const UserControl = () => {
  const [renderConnectionControls] = useUserControl();
  const { user } = useContext(UserContext);

  return(
    <>
      <div className="user-control-container">
        { renderConnectionControls() }
        <div className="username-avatar-buttons-container">
          <span className="username-and-avatar-control">
            <img src ={user.photoURL} className="user-control-avatar" />
            <span className="user-control-username">{user.displayName}</span>
          </span>
          <span className="settings-button-container">
            <UserSettingModal/>
          </span>
        </div>
      </div>
    </>
  )
}

export default UserControl;