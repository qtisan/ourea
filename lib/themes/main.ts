import { createMuiTheme } from "@material-ui/core";
import Color from 'color';

const primaryColor = Color('#ff558bff'),
  secondaryColor = Color('#9f6affff'),
  whiteColor = Color('#fdfdfdff'),
  blackColor = Color('#2f2b2cff');
const rgb = (color: Color): string => color.rgb().toString();

let theme = createMuiTheme({
  typography: {
    h5: {
      fontWeight: 500,
      fontSize: 26,
      letterSpacing: 0.5,
    },
  },
  palette: {
    primary: {
      light: rgb(primaryColor.lighten(.6)),
      main: rgb(primaryColor),
      dark: rgb(primaryColor.darken(.6)),
    },
    secondary: {
      light: rgb(secondaryColor.lighten(.6)),
      main: rgb(secondaryColor),
      dark: rgb(secondaryColor.darken(.6)),
    },
    common: {
      white: rgb(whiteColor),
      black: rgb(blackColor),
    },
    grey: {
      50: rgb(blackColor.lighten(4.4)),
      100: rgb(blackColor.lighten(4.1)),
      200: rgb(blackColor.lighten(3.8)),
      300: rgb(blackColor.lighten(3.5)),
      400: rgb(blackColor.lighten(3)),
      500: rgb(blackColor.lighten(2)),
      600: rgb(blackColor.lighten(1.5)),
      700: rgb(blackColor.lighten(1.2)),
    }
  },
  shape: {
    borderRadius: 8,
  },
});

theme = {
  ...theme,
  overrides: {
    MuiDrawer: {
      paper: {
        backgroundColor: rgb(whiteColor),
      },
      paperAnchorDockedLeft: {
        borderRight: 0
      }
    },
    MuiButton: {
      label: {
        textTransform: 'none',
      },
      contained: {
        boxShadow: 'none',
        '&:active': {
          boxShadow: 'none',
        },
      },
    },
    MuiTabs: {
      root: {
        marginLeft: theme.spacing(1),
      },
      indicator: {
        height: 3,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        backgroundColor: theme.palette.common.white,
      },
    },
    MuiTab: {
      root: {
        textTransform: 'none',
        margin: '0 16px',
        minWidth: 0,
        padding: 0,
        [theme.breakpoints.up('md')]: {
          padding: 0,
          minWidth: 0,
        },
      },
    },
    MuiIconButton: {
      root: {
        padding: theme.spacing(1),
      },
    },
    MuiTooltip: {
      tooltip: {
        borderRadius: 4,
      },
    },
    MuiDivider: {
      root: {
        backgroundColor: '#404854',
      },
    },
    MuiListItemText: {
      primary: {
        fontWeight: theme.typography.fontWeightMedium,
      },
    },
    MuiListItemIcon: {
      root: {
        color: 'inherit',
        marginRight: 0,
        '& svg': {
          fontSize: 20,
        },
      },
    },
    MuiAvatar: {
      root: {
        width: 32,
        height: 32,
      },
    },
  },
  props: {
    MuiTab: {
      disableRipple: true,
    },
  },
  mixins: {
    ...theme.mixins,
    toolbar: {
      minHeight: 48,
    },
  },
};

export default theme;