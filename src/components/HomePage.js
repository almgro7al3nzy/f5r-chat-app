import React from "react";
import { Link } from 'react-router-dom';
import history from '../utilities/history';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
  root: {
    background: 'linear-gradient(45deg, #482861 30%, #6a82ab 90%)',
    borderRadius: 3,
    border: 0,
    color: 'white',
    height: 48,
    padding: '0 30px',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    width: '100%',
    fontSize: '1.2rem',
    marginTop: '10px',
    display: 'block',
  },
  label: {
    textTransform: 'capitalize',
    fontFamily: 'whitney-book',
  },
  textfield: {
    background: '#b08bb0',
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
    color: 'rgb(50, 53, 59)',

  },
  signinButton: {
    height: '48px',
    padding: '0 30px',
    color: '#653987',
    fontSize: '1.2rem',
    fontFamily: 'whitney-book',
    marginLeft: '30px',
  },
  textfieldHeading: {
    color: '#653987',
    fontSize: '1.2rem',
    fontFamily: 'whitney-book',
    paddingBottom: '5px',
  }
});

const HomePage = () => {

  const classes = useStyles();

  return (
    <div className="back">
      <div className="signin-block">
        <Button 
          classes={{
            root: classes.root,
            label: classes.label,
          }}
          onClick = {() => {history.push('/signin')}}
          >
            Log In
        </Button>
        <Button 
            classes={{
              root: classes.root,
              label: classes.label,
            }}
            onClick = {() => {history.push('/signup')}}
            >
              Register
        </Button>
      </div>

    </div>
    
    );
  }
  
  export default HomePage;