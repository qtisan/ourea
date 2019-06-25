import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles, Theme } from '@material-ui/core/styles';
import Drawer, { DrawerProps } from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import PeopleIcon from '@material-ui/icons/People';
import { Styles } from '@material-ui/core/styles/withStyles';
import { Link } from '@material-ui/core';


const styles: Styles<Theme, {}> = (theme: Theme) => ({
  root: {
    paddingBottom: theme.spacing(4),
  },
  categoryHeader: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    '&:not(:first-of-type)': {
      marginTop: theme.spacing(2),
    },
    '&:not([class*=firebase])': {
      borderTop: 'solid 1px #eee',
    }
  },
  categoryHeaderPrimary: {
    color: theme.palette.common.black,
  },
  item: {
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: theme.spacing(5),
    color: theme.palette.grey[500],
    '&:hover,&:focus': {
      backgroundColor: theme.palette.grey[200],
      color: theme.palette.grey[700]
    },
  },
  clearUnderline: {
    '&:hover,&:focus': {
      textDecoration: 'none !important'
    }
  },
  itemCategory: {
    boxShadow: theme.shadows[0],
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    '&:not([class*=firebase])': {
      borderTop: 'solid 1px #eee',
      marginBottom: -theme.spacing(2)
    }
  },
  firebase: {
    fontSize: 24,
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  itemActiveItem: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.secondary.light
  },
  itemPrimary: {
    fontSize: 'inherit',
  },
  itemIcon: {
    minWidth: 'auto',
    marginRight: theme.spacing(2),
  },
  logoImage: {
    width: '100%',
    marginLeft: -theme.spacing(1)
  },
});

export interface CategoryItem {
  id: string,
  name: string,
  icon?: JSX.Element,
  link?: string,
  children?: CategoryItem[],
  active?: boolean
}

export type NavigatorProps = {
  classes?: any,
  logo: string,
  categories: CategoryItem[],
  overview: { text: string, link: string }
} & DrawerProps;

function Navigator(props: NavigatorProps) {
  const { classes, logo, categories, overview, ...drawerProps } = props;
  const { style } = drawerProps;
  return (
    <Drawer variant="permanent" {...drawerProps}>
      <List disablePadding className={classes.root} style={{ width: style && style.width || 'auto'}}>
        <ListItem className={clsx(classes.firebase, classes.itemCategory)}>
          <img src={logo} className={classes.logoImage} />
        </ListItem>
        <Link href={overview.link} className={classes.clearUnderline}>
          <ListItem className={clsx(classes.item, classes.itemCategory)} button>
              <ListItemIcon className={classes.itemIcon}>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText
                classes={{
                  primary: classes.itemPrimary,
                }}
              >
                {overview.text}
              </ListItemText>
          </ListItem>
        </Link>
        {categories.map(({ id, name, children }) => (
          <React.Fragment key={id}>
            <ListItem className={classes.categoryHeader}>
              <ListItemText
                classes={{
                  primary: classes.categoryHeaderPrimary,
                }}
              >
                {name}
              </ListItemText>
            </ListItem>
            {children && children.map(({ id: childId, name: childName, link, icon, active }) => (
              <Link href={link} key={childId} className={classes.clearUnderline}>
                <ListItem
                  key={childId}
                  button
                  className={clsx(classes.item, active && classes.itemActiveItem)}
                >
                  <ListItemIcon className={classes.itemIcon}>{icon || <PeopleIcon />}</ListItemIcon>
                  <ListItemText
                    classes={{
                      primary: classes.itemPrimary,
                    }}
                  >
                    {childName}
                  </ListItemText>
                </ListItem>
              </Link>
            ))}
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
}

Navigator.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Navigator);
