import {
  Theme, createStyles, withStyles, Paper, AppBar, Toolbar, Grid, TextField,
  Button, Tooltip, IconButton, Typography
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import RefreshIcon from '@material-ui/icons/Refresh';
import { WithStyles } from "@material-ui/core/styles";
import { Component } from "react";
import ManageContainer from "../../lib/containers/ManageContainer";
import { inject, observer } from "mobx-react";
import { IStore } from "../../lib/stores";


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
  store: IStore;
}


@inject('store')
@observer
class ManageIndex extends Component<ManageIndexProps> {
  refresh() {
    this.props.store.refreshTokens();
  }
  async makReq() {
    await this.props.store.request('/do', {
      action: 'test1'
    });
  }
  test(): Array<any> {
    const t = this.props.store.getResult('test');
    if (t) {
      return t.data.posts;
    }
    return [];
  }
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
                  <Button variant="contained" color="primary" className={classes.addUser}
                    onClick={this.makReq.bind(this)}
                  >
                    Add user
                  </Button>
                  <Tooltip title="Reload">
                    <IconButton onClick={this.refresh.bind(this)}>
                      <RefreshIcon className={classes.block} color="inherit" />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            </Toolbar>
          </AppBar>
          <div className={classes.contentWrapper}>
            <Typography color="textSecondary" align="center" style={{ overflowWrap: 'break-word' }}>
              {this.props.store.tokens.access_token}
            </Typography>
            {this.test().map(p => (
              <Typography color="textPrimary" align="center" style={{ overflowWrap: 'break-word' }}>
                {p.title}
              </Typography>
            ))}
          </div>
        </Paper>

      </ManageContainer>
    )
  }
}

export default withStyles(styles)(ManageIndex);