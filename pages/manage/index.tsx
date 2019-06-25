import {
  Theme, createStyles, withStyles, Paper, AppBar, Toolbar, Grid, TextField,
  Button, Tooltip, IconButton, Typography
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import RefreshIcon from '@material-ui/icons/Refresh';
import { WithStyles } from "@material-ui/styles";
import { Component } from "react";
import ManageContainer from "../../lib/containers/ManageContainer";


const styles = (theme: Theme) => createStyles({
  paper: {
    maxWidth: 936,
    margin: 'auto',
    overflow: 'hidden',
  },
  searchBar: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  },
  searchInput: {
    fontSize: theme.typography.fontSize,
  },
  block: {
    display: 'block',
  },
  addUser: {
    marginRight: theme.spacing(1),
  },
  contentWrapper: {
    margin: '40px 16px',
  },
});

interface ManageIndexProps extends WithStyles<typeof styles> {
  classes: any;
}

export default withStyles(styles)(
  class extends Component<ManageIndexProps, {}> {
    render() {
      const { classes } = this.props;
      return (
        <ManageContainer>
          
          <Paper className={classes.paper}>
            <AppBar className={classes.searchBar} position="static" color="default" elevation={0}>
              <Toolbar>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <SearchIcon className={classes.block} color="inherit" />
                  </Grid>
                  <Grid item xs>
                    <TextField
                      fullWidth
                      placeholder="Search by email address, phone number, or user UID"
                      InputProps={{
                        disableUnderline: true,
                        className: classes.searchInput,
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <Button variant="contained" color="primary" className={classes.addUser}>
                      Add user
                    </Button> 
                    <Tooltip title="Reload">
                      <IconButton>
                        <RefreshIcon className={classes.block} color="inherit" />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
              </Toolbar>
            </AppBar>
            <div className={classes.contentWrapper}>
              <Typography color="textSecondary" align="center">
                No users for this project yet
            </Typography>
            </div>
          </Paper>

        </ManageContainer>
      )
    }
  }
);