import {
  Avatar,
  Box,
  createStyles,
  Fab,
  Grid,
  IconButton,
  InputAdornment,
  Typography
} from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';
import { Directions, Visibility, VisibilityOff } from '@material-ui/icons';
import { Component } from 'react';

import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import { SingletonRouter } from 'next/router';
import { md5 } from 'phusis';
import CenteredGrid from '../../lib/components/CenteredGrid';
import ErrortipInput from '../../lib/components/ErrortipInput';
import config from '../../lib/config';
import validatable, { Validator } from '../../lib/decorators/validatable';
import withRouter from '../../lib/decorators/withRouter';
import RootLayout from '../../lib/layout/RootLayout';
import { IStore } from '../../lib/stores';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      background: `url(${config.background.signin})`,
      height: '100vh',
      margin: 0
    },
    panel: { minWidth: 500 },
    logo: {
      width: '100%',
      '&>img': {
        [theme.breakpoints.up('lg')]: { width: '15%' },
        [theme.breakpoints.up('md')]: { width: '25%' },
        [theme.breakpoints.down('md')]: { width: '30%' },
        [theme.breakpoints.down('sm')]: { width: '85%' }
      }
    },
    cate: {
      '&>div': {
        border: 'solid 1px #9a9a9c',
        padding: '0 16px',
        color: theme.palette.grey[600],
        [theme.breakpoints.up('lg')]: { fontSize: '2.5rem' },
        [theme.breakpoints.up('md')]: { fontSize: '1.5rem' },
        [theme.breakpoints.down('md')]: { fontSize: '2rem' }
      }
    },
    avatar: {
      width: '5rem',
      height: '5rem'
    },
    link: {
      margin: '0 6px',
      color: theme.palette.primary.light,
      fontWeight: 700,
      textDecoration: 'underline',
      cursor: 'pointer'
    },
    submit: {
      marginTop: '1rem',
      borderRadius: 100
    }
  });

interface ISigninProps {
  classes: any;
  store: IStore;
  validator: Validator;
  router: SingletonRouter;
}
@validatable<ISigninProps>()
@inject('store')
@withRouter
@observer
class Signin extends Component<ISigninProps> {
  @observable showPassword = false;

  signin = async () => {
    // TODO: disable button while signin.
    const { getFieldValues, validateAll, getFieldErrors, setField } = this.props.validator;
    const { store } = this.props;
    const anon = store.currentUser.isAnonymous();
    if (!anon) {
      setField('signinEmail', store.currentUser.username);
    }
    if (await validateAll()) {
      const { signinEmail, signinPassword } = getFieldValues();
      await store.signin(signinEmail, signinPassword);
    } else {
      getFieldErrors().forEach((err) => {
        store.snackbar.error(err);
      });
    }
  };
  handleClickShowPassword = () => {
    this.showPassword = !this.showPassword;
  };

  render() {
    const { classes, store, router, validator } = this.props;
    const anon = store.currentUser.isAnonymous();
    const { showPassword } = this;
    const { register, getFieldError } = validator;
    return (
      <RootLayout>
        <CenteredGrid className={classes.root}>
          <Grid item className={classes.panel} xs={11} md={10} lg={8}>
            <CenteredGrid className={classes.logo}>
              <img src={config.logo.transparent} />
            </CenteredGrid>
            <CenteredGrid className={classes.cate}>
              <Box>PASSPORT</Box>
            </CenteredGrid>
            <CenteredGrid style={{ marginTop: '2rem' }}>
              <Avatar src={config.prefixed(store.currentUser.avatar)} className={classes.avatar} />
            </CenteredGrid>
            <CenteredGrid style={{ marginTop: '1rem' }}>
              <Typography variant="h4">
                {anon
                  ? 'Hey! Nice to meet you, my friend. '
                  : `Welcome back, dear ${store.currentUser.username}!`}
              </Typography>
            </CenteredGrid>
            <CenteredGrid>
              <Typography variant="h6">
                {`Please sign in with your credentials below, or ${anon ? '' : 'Sign in with '}`}
              </Typography>
              <a
                onClick={() =>
                  anon
                    ? router.replace('/signup')
                    : (() => {
                        // TODO: clear local user state.
                      })()
                }
              >
                <Typography variant="h6" className={classes.link}>
                  {anon ? 'SIGN UP' : 'ANOTHER USER'}
                </Typography>
              </a>
              <Typography variant="h6">{anon ? ' for a new USER !' : '.'}</Typography>
            </CenteredGrid>
            <CenteredGrid style={{ marginTop: '2rem' }}>
              {anon && (
                <CenteredGrid>
                  <ErrortipInput
                    id="signinEmail"
                    style={{ minWidth: 320 }}
                    label="Email"
                    placeholder="Input your email address."
                    margin="normal"
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true
                    }}
                    {...register('signinEmail', {
                      rules: {
                        required: true,
                        type: 'email',
                        message: 'it should be a valid email address.'
                      }
                    })}
                    errmsg={getFieldError('signinEmail')}
                  />
                </CenteredGrid>
              )}
              <CenteredGrid>
                <ErrortipInput
                  id="signinPassword"
                  style={{ minWidth: 320 }}
                  label="Password"
                  placeholder="Input your password."
                  type={showPassword ? 'text' : 'password'}
                  margin="normal"
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          aria-label="Toggle password visibility"
                          onClick={this.handleClickShowPassword}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  {...register('signinPassword', {
                    rules: { required: true, message: 'passowrd should not be empty!' },
                    handleValue: md5
                  })}
                  errmsg={getFieldError('signinPassword')}
                />
              </CenteredGrid>
              {/*
              // TODO: add progress bar while signin.
              // TODO: add access key with <Enter>.
              */}
              <CenteredGrid>
                <Fab size="large" color="primary" className={classes.submit} onClick={this.signin}>
                  <Directions />
                </Fab>
              </CenteredGrid>
            </CenteredGrid>
          </Grid>
        </CenteredGrid>
      </RootLayout>
    );
  }
}
// TODO: lift the withRouter to a decorator.
export default withStyles(styles)(Signin);
