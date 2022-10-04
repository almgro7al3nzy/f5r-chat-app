import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from "@material-ui/core/Typography";
import Paper from '@material-ui/core/Paper';

import useSettings from '../../../hooks/useSettings';

const useStyles = makeStyles({
  signout: {
    padding: '6px 10px',
    height: '48px',
    color: 'red',
    fontSize: '16px',
    fontFamily: 'whitney-book',
    lineHeight: '20px',
    display: 'block',
    marginTop: '10px',
    "&:hover": {
      backgroundColor: 'rgba(240, 71, 71, 0.1)',
    },
  },
  buttonlabel: {
    fontFamily: 'whitney-book',
    fontSize: '14px',
    fontWeight: '500',
  },
  heading: {
    color: '#8e9297',
    fontSize: '12px',
    fontFamily: 'whitney-book',
    padding: '0px 10px 6px',
  }

}); 
const SettingsSidebar = () => {
  const classes = useStyles();
  const [handleOnSignout] = useSettings();
  return (
    <div className="settings-sidebar" >
      <Typography
        classes={{
          root: classes.heading,
        }}
      >
        USER SETTINGS
      </Typography>
      <Button
        classes={{
          root: classes.signout,
          label: classes.buttonlabel,
        }}
        onClick={handleOnSignout}
      >
        Sign Out
      </Button>
    </div>
  );
}
 
export default SettingsSidebar;