import { CssBaseline } from '@material-ui/core';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { createStyles, ThemeProvider } from '@material-ui/styles';
import React from 'react';
import theme from '../themes/main';
import SnackbarPlugin from './SnackbarPlugin';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      minHeight: '100vh',
      fontSize: theme.typography.fontSize
    }
  });

export interface RootLayoutProps extends WithStyles<typeof styles> {
  classes: any;
  children?: JSX.Element[] | JSX.Element;
}

export default withStyles(styles)(
  class extends React.Component<RootLayoutProps, { mobileOpen: boolean }> {
    render() {
      const { classes, children } = this.props;

      return (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className={classes.root}>
            <SnackbarPlugin />
            {children}
          </div>
        </ThemeProvider>
      );
    }
  }
);
