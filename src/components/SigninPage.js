import React, { useState, useContext } from "react";
import { Link } from 'react-router-dom';

import Grid from '@material-ui/core/Grid'
import Typography from "@material-ui/core/Typography";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import server from '../apis/server';
import UserContext from '../contexts/UserContext';
import history from '../utilities/history';
import '../styles/Signin.css';

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

const SignIn = props => {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const { setUser, setIsAuth } = useContext(UserContext);

  const signInWithEmailAndPasswordHandler = (event,email, password) => {
      event.preventDefault();
      server.post('/user/signin', { email, password })
        .then(response => {
          console.log(response.data);
          setUser(response.data);
          setIsAuth(true);
          console.log('location state', props.location.state);
          const destination = props.location.state? props.location.state.from : '/chat';
          history.push(destination);
        })
        .catch(error => {
          console.log('log in failed', error, error.response)
          setError(JSON.stringify(error.response.data))
        });
    };

  const onChangeHandler = (event) => {
      const {id, value} = event.currentTarget;
    
      if(id === 'userEmail') {
        setEmail(value);
      }
      else if(id === 'userPassword'){
        setPassword(value);
      }
  };

return (
  <div className="back">
    <div className="signin-block">
      <Grid container spacing={3}>
      <Grid item xs={6}>
          <img 
            src='https://res.cloudinary.com/walkietalkie/image/upload/v1591142932/output-onlinepngtools_n68sel.png'
            className='img' 
          />
        </Grid>
        <Grid className ="signin-left" item xs={6}>
          <Typography 
            classes={{ root: classes.heading}}
            >
            Welcome Back!
          </Typography>
          {error !== null && <div className="error-text">{error}</div>}
          <form className="signin-form">
            <Typography classes= {{root: classes.textfieldHeading}}>
              Email
            </Typography>
            <TextField
              required
              id="userEmail"
              classes={{ root: classes.textfield}}
              value={email}
              autoComplete="off"
              variant="outlined"
              placeholder="Email"
              onChange={(event) => onChangeHandler(event)}
            />
            <Typography classes= {{root: classes.textfieldHeading}}>
              Password
            </Typography>
            <TextField 
              required
              id="userPassword"
              classes={{ root: classes.textfield}}
              value={password}
              autoComplete="off"
              placeholder="Password"
              type="password"
              variant="outlined"
              onChange={(event) => onChangeHandler(event)}
            />
            <Link to="passwordReset">
              Forgot your password?
            </Link>
            <Button 
            classes={{
              root: classes.root,
              label: classes.label,
            }}
            onClick = {(event) => {signInWithEmailAndPasswordHandler(event, email, password)}}
            >
              Log In
            </Button>
            <p>
              Need an account?{" "}
              <Link to="signup">
                Register
              </Link> 
            </p>
          </form>
        </Grid>
      </Grid>
      </div>
  </div>
);
};

export default SignIn;