import React from 'react';
import { withStyles, Theme, WithStyles } from '@material-ui/core/styles';
import { ThemeProvider, createStyles } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Hidden from '@material-ui/core/Hidden';
import Navigator, { NavigatorProps } from '../components/Navigator';
import Header from '../components/Header';
import theme from "../themes/main";


const drawerWidth = 256;

const styles = (theme: Theme) => createStyles({
  root: {
    display: 'flex',
    minHeight: '100vh',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  mainContent: {
    flex: 1,
    padding: '48px 36px 0',
    background: '#eaeff1',
  },
});

export interface ManageLayoutProps extends WithStyles<typeof styles> {
  classes: any,
  children?: JSX.Element[] | JSX.Element,
  navigatorProps: NavigatorProps
};

export default withStyles(styles)(

  class extends React.Component<ManageLayoutProps, { mobileOpen: boolean }> {
    state = {
      mobileOpen: false,
    };

    handleDrawerToggle = () => {
      this.setState(state => ({ mobileOpen: !state.mobileOpen }));
    };

    render() {
      const { classes, children, navigatorProps } = this.props;

      return (
        <ThemeProvider theme={theme}>
          <div className={classes.root}>
            <CssBaseline />
            <nav className={classes.drawer}>
              <Hidden smUp implementation="js">
                <Navigator {
                    ...{
                      ...navigatorProps,
                      style: { width: drawerWidth }
                    }
                  }
                  variant="temporary"
                  open={this.state.mobileOpen}
                  onClose={this.handleDrawerToggle} />
              </Hidden>
              <Hidden xsDown implementation="css">
                <Navigator {...{ style: { width: drawerWidth }, ...navigatorProps}}/>
              </Hidden>
            </nav>
            <div className={classes.appContent}>
              <Header onDrawerToggle={this.handleDrawerToggle} />
              <main className={classes.mainContent}>
                {children}
              </main>
            </div>
          </div>
        </ThemeProvider>
      );
    }
  }

);
