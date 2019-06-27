import React from 'react';
import { withStyles, Theme, createStyles, WithStyles } from '@material-ui/core/styles';

import ManageLayout from "../layout/ManageLayout";
import { CategoryItem } from "../components/Navigator";

const categories: CategoryItem[] = [
  {
    id: 'Develop',
    name: '软件开发',
    children: [
      { id: 'Authentication', name: '权限管理', icon: 'People', active: true, link: '/container' },
      { id: 'Database', name: '数据', icon: 'DnsRounded', link: '/container' },
      { id: 'Storage', name: '存储', icon: 'PhotoSizeSelectActual', link: '/container' },
      { id: 'Hosting', name: '主机', icon: 'Public', link: '/container' },
      { id: 'Functions', name: '函数', icon: 'SettingsEthernet', link: '/container' },
      { id: 'ML Kit', name: '软件包', icon: 'SettingsInputComponent', link: '/container' },
    ],
  },
  {
    id: 'Quality',
    name: '系统管理',
    children: [
      { id: 'user_nanage', name: '用户管理', icon: 'Settings', link: '/container' },
      { id: 'system_log', name: '操作日志', icon: 'Timer', link: '/container' },
      { id: 'system_settings', name: '系统设置', icon: 'PhoneLinkSetup', link: '/container' },
    ],
  },
];
let logo = '/static/images/ourea_brand-transparent.svg';

const styles = (theme: Theme) => createStyles({
  root: {
    fontWeight: 'inherit',
    '&:before': {
      border: theme.spacing(0)
    }
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
