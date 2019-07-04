import { createStyles, Box } from "@material-ui/core";
import { withStyles, Theme } from '@material-ui/core/styles';
import { Component } from "react";

import config from '../../lib/config';

const styles = (theme: Theme) => createStyles({
  root: {
    background: `url(${config.background.signin})`,
    height: '100vh',
    margin: 0
  },
  logo: {
    width: '100%',
    '&>img': {
      [theme.breakpoints.up('lg')]: { width: '15%' },
      [theme.breakpoints.up('md')]: { width: '25%' },
      [theme.breakpoints.down('md')]: { width: '30%' },
      [theme.breakpoints.down('sm')]: { width: '85%' }
    }
  }
});

class Signin extends Component<{ classes: any }, {}> {

  render() {
    const { classes } = this.props;
    return (
      <Box className={classes.root} display="flex" justifyContent="center" alignItems="center">
        <Box justifyContent="center" display="flex" className={classes.logo}>
          <img src={config.logo.transparent} />
        </Box>
      </Box>
    );
  }

}

export default withStyles(styles)(Signin);
