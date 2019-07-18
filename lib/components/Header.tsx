import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import { Theme, withStyles } from '@material-ui/core/styles';
import { Styles } from '@material-ui/core/styles/withStyles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import HelpIcon from '@material-ui/icons/Help';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import clsx from 'clsx';
import { inject, observer } from 'mobx-react';
import Link from 'next/link';
import React, { Component } from 'react';
import { IStore } from '../stores';

const lightColor = 'rgba(255, 255, 255, 0.7)';

const styles: Styles<Theme, {}> = (theme: Theme) => ({
  secondaryBar: {
    zIndex: 0
  },
  tabBar: {
    backgroundColor: theme.palette.grey[100]
  },
  menuButton: {
    marginLeft: -theme.spacing(1)
  },
  iconButtonAvatar: {
    padding: 4
  },
  link: {
    textDecoration: 'none',
    color: lightColor,
    '&:hover': {
      color: theme.palette.common.white
    }
  },
  button: {
    borderColor: lightColor
  }
});

@inject('store')
@observer
class Header extends Component<{ classes: any; onDrawerToggle: any; store: IStore }> {
  signout = async () => {
    const { store } = this.props;
    await store.signout();
  };

  render() {
    const { classes, onDrawerToggle, store } = this.props;

    return (
      <>
        <AppBar color="primary" position="sticky" elevation={0}>
          <Toolbar>
            <Grid container spacing={1} alignItems="center">
              <Hidden smUp>
                <Grid item>
                  <IconButton
                    color="inherit"
                    aria-label="Open drawer"
                    onClick={onDrawerToggle}
                    className={classes.menuButton}
                  >
                    <MenuIcon />
                  </IconButton>
                </Grid>
              </Hidden>
              <Grid item xs />
              <Grid item>
                <Typography className={classes.link} component="a">
                  Go to docs
                </Typography>
              </Grid>
              <Grid item>
                <Tooltip title="Alerts">
                  <IconButton color="inherit">
                    <NotificationsIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item>
                <Link href="/passport/signin">
                  <Tooltip title={store.currentUser.username}>
                    <IconButton
                      color="inherit"
                      className={classes.iconButtonAvatar}
                      onClick={this.signout}
                    >
                      <Avatar
                        className={classes.avatar}
                        src={store.currentUser.avatar}
                        alt={store.currentUser.username}
                      />
                    </IconButton>
                  </Tooltip>
                </Link>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <AppBar
          component="div"
          className={classes.secondaryBar}
          color="primary"
          position="static"
          elevation={0}
        >
          <Toolbar>
            <Grid container alignItems="center" spacing={1}>
              <Grid item xs>
                <Typography color="inherit" variant="h5" component="h1">
                  Authentication
                </Typography>
              </Grid>
              <Grid item>
                <Button className={classes.button} variant="outlined" color="inherit" size="small">
                  Web setup
                </Button>
              </Grid>
              <Grid item>
                <Tooltip title="Help">
                  <IconButton color="inherit">
                    <HelpIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <AppBar
          component="div"
          className={clsx(classes.secondaryBar, classes.tabBar)}
          color="primary"
          position="static"
          elevation={0}
        >
          <Tabs value={0} textColor="inherit">
            <Tab textColor="inherit" label="Users" />
            <Tab textColor="inherit" label="Sign-in method" />
            <Tab textColor="inherit" label="Templates" />
            <Tab textColor="inherit" label="Usage" />
          </Tabs>
        </AppBar>
      </>
    );
  }
}

export default withStyles(styles)(Header);
