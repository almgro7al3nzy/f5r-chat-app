import React from 'react';
import Paper from '@material-ui/core/Paper';

import '../../styles/ActiveBar.css';
import useActiveMemberBar from '../../hooks/useActiveMemberBar';

const ActiveMemberBar = () => {
  const [userList] = useActiveMemberBar();
  
  return(
    <Paper className="active-member-bar">
      <div className="member-group">
        <div className="channel-title-color member-group-title">Online — {userList.onlines.length}</div>
        {userList.onlines}
      </div>
      <div className="member-group">
        <div className="channel-title-color member-group-title">Offline — {userList.offlines.length}</div>
        {userList.offlines}
      </div>
    </Paper>
  );
};

export default ActiveMemberBar;