import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import { withStyles, Theme, createStyles, WithStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import RefreshIcon from '@material-ui/icons/Refresh';
import PeopleIcon from '@material-ui/icons/People';
import DnsRoundedIcon from '@material-ui/icons/DnsRounded';
import PermMediaOutlinedIcon from '@material-ui/icons/PhotoSizeSelectActual';
import PublicIcon from '@material-ui/icons/Public';
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';
import SettingsInputComponentIcon from '@material-ui/icons/SettingsInputComponent';
import TimerIcon from '@material-ui/icons/Timer';
import SettingsIcon from '@material-ui/icons/Settings';
import PhonelinkSetupIcon from '@material-ui/icons/PhonelinkSetup';

import ManageLayout from "../lib/layout/ManageLayout";

const categories = [
  {
    id: 'Develop',
    name: '软件开发',
    children: [
      { id: 'Authentication', name: '权限管理', icon: <PeopleIcon />, active: true, link: '/container' },
      { id: 'Database', name: '数据', icon: <DnsRoundedIcon />, link: '/container' },
      { id: 'Storage', name: '存储', icon: <PermMediaOutlinedIcon />, link: '/container' },
      { id: 'Hosting', name: '主机', icon: <PublicIcon />, link: '/container' },
      { id: 'Functions', name: '函数', icon: <SettingsEthernetIcon />, link: '/container' },
      { id: 'ML Kit', name: '软件包', icon: <SettingsInputComponentIcon />, link: '/container' },
    ],
  },
  {
    id: 'Quality',
    name: '质量控制中心',
    children: [
      { id: 'Analytics', name: '数据分析', icon: <SettingsIcon />, link: '/container' },
      { id: 'Performance', name: '性能管理', icon: <TimerIcon />, link: '/container' },
      { id: 'Test Lab', name: '测试实验室', icon: <PhonelinkSetupIcon />, link: '/container' },
    ],
  },
];
let logo = '/static/images/ourea_brand-transparent.svg';

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

interface Props extends WithStyles<typeof styles> {
  classes: any
}

export default withStyles(styles)(

  class extends React.Component<Props, {}> {
    render() {
      const { classes } = this.props;

      return (
        <ManageLayout navigatorProps={{
          logo, categories
        }}>
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
        </ManageLayout>
      );
    }
  }

);
