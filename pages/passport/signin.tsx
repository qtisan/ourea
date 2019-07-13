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
import Link from 'next/link';
import { Component } from 'react';

import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import { md5 } from 'phusis';
import CenteredGrid from '../../lib/components/CenteredGrid';
import ErrortipInput from '../../lib/components/ErrortipInput';
import config from '../../lib/config';
import validatable, { Validator } from '../../lib/decorators/validatable';
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
}
@validatable<ISigninProps>()
@inject('store')
@observer
class Signin extends Component<ISigninProps> {
  @observable showPassword = false;

  signin = async () => {
    const { getFieldValues, validateAll, getFieldErrors } = this.props.validator;
    const { store } = this.props;
    if (await validateAll()) {
      const { signinEmail, signinPassword } = getFieldValues();
      console.log('values', { signinEmail, signinPassword });
      const response = await store.do({
        action: 'passport/signin',
        payload: { username: signinEmail, password: signinPassword }
      });
      console.log('response', response);
    } else {
      getFieldErrors().forEach((e) => {
        store.snackbar.error(e);
      });
    }
  };
  handleClickShowPassword = () => {
    this.showPassword = !this.showPassword;
  };

  render() {
    const { classes, store } = this.props;
    const anon = store.currentUser.isAnonymous();
    const { showPassword } = this;
    const { register, getFieldError } = this.props.validator;
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
              <Link {...(anon ? { href: 'signup' } : { onClick: () => {} })}>
                <Typography variant="h6" className={classes.link}>
                  {anon ? 'SIGN UP' : 'ANOTHER USER'}
                </Typography>
              </Link>
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

export default withStyles(styles)(Signin);
