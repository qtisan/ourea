import React from 'react';
import { withStyles, Theme, createStyles, WithStyles } from '@material-ui/core/styles';
import PeopleIcon from '@material-ui/icons/People';
import DnsRoundedIcon from '@material-ui/icons/DnsRounded';
import PermMediaOutlinedIcon from '@material-ui/icons/PhotoSizeSelectActual';
import PublicIcon from '@material-ui/icons/Public';
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';
import SettingsInputComponentIcon from '@material-ui/icons/SettingsInputComponent';
import TimerIcon from '@material-ui/icons/Timer';
import SettingsIcon from '@material-ui/icons/Settings';
import PhonelinkSetupIcon from '@material-ui/icons/PhonelinkSetup';

import ManageLayout from "../layout/ManageLayout";

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
    name: '系统管理',
    children: [
      { id: 'user_nanage', name: '用户管理', icon: <SettingsIcon />, link: '/container' },
      { id: 'system_log', name: '操作日志', icon: <TimerIcon />, link: '/container' },
      { id: 'system_settings', name: '系统设置', icon: <PhonelinkSetupIcon />, link: '/container' },
    ],
  },
  {
    id: 'Quality',
    name: '系统管理',
    children: [
      { id: 'user_nanage', name: '用户管理', icon: <SettingsIcon />, link: '/container' },
      { id: 'system_log', name: '操作日志', icon: <TimerIcon />, link: '/container' },
      { id: 'system_settings', name: '系统设置', icon: <PhonelinkSetupIcon />, link: '/container' },
    ],
  },
  {
    id: 'Quality',
    name: '系统管理',
    children: [
      { id: 'user_nanage', name: '用户管理', icon: <SettingsIcon />, link: '/container' },
      { id: 'system_log', name: '操作日志', icon: <TimerIcon />, link: '/container' },
      { id: 'system_settings', name: '系统设置', icon: <PhonelinkSetupIcon />, link: '/container' },
    ],
  },
  {
    id: 'Quality',
    name: '系统管理',
    children: [
      { id: 'user_nanage', name: '用户管理', icon: <SettingsIcon />, link: '/container' },
      { id: 'system_log', name: '操作日志', icon: <TimerIcon />, link: '/container' },
      { id: 'system_settings', name: '系统设置', icon: <PhonelinkSetupIcon />, link: '/container' },
    ],
  },
];
let logo = '/static/images/ourea_brand-transparent.svg';

const styles = (theme: Theme) => createStyles({
  root: {
    fontWeight: 'inherit'
  }
});

interface Props extends WithStyles<typeof styles> {
  classes: any,
  children?: JSX.Element[] | JSX.Element
}

export default withStyles(styles)(

  class extends React.Component<Props, {}> {
    render() {
      const { children } = this.props;

      return (
        <ManageLayout navigatorProps={{
          logo, categories, overview: { text: '项目概览', link: '/manage' }
        }}>
          {children}
        </ManageLayout>
      );
    }
  }

);
