import { createMuiTheme } from '@material-ui/core';
import Color from 'color';

declare module '@material-ui/core/styles/createPalette' {
  interface Palette {
    success: PaletteColor;
  }
  interface PaletteOptions {
    success?: PaletteColorOptions;
  }
  interface PaletteColor extends ColorPartial {}
}

const blackColor = Color('#2f2b2cff');
const opacitier = (color: Color, multi: number = 2): string => {
  const a = color.alpha() * multi;
  return color.alpha(a > 1 ? 1 : a).toString();
};
const rgb = (color: Color, alpha: number = 1): string =>
  color
    .alpha(alpha)
    .rgb()
    .toString();
const appendExtraColor = (color: string) => ({
  light: rgb(Color(color).lighten(0.2)),
  main: rgb(Color(color)),
  dark: rgb(Color(color).darken(0.6)),
  A200: opacitier(Color(color), 0.6),
  A400: opacitier(Color(color), 0.75),
  A700: opacitier(Color(color), 0.9)
});

let theme = createMuiTheme({
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Helvetica Neue"',
      '"Segoe UI"',
      'Roboto',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(','),
    fontSize: 14,
    htmlFontSize: 14
  },
  palette: {
    primary: {
      50: 'linear-gradient(45deg, #ffa9c4 30%, #ffc7aa 90%)',
      100: 'linear-gradient(45deg, #ff558b 30%, #ff8e53 90%)',
      200: 'linear-gradient(45deg, #d40042 30%, #ec5405 90%)',
      ...appendExtraColor('#ff558b')
    },
    secondary: {
      50: 'linear-gradient(45deg, #c4a4ff 40%, #a9bbfb 90%)',
      100: 'linear-gradient(45deg, #9f6aff 40%, #6c8cff 90%)',
      200: 'linear-gradient(45deg, #7e11e0 40%, #365ad8 90%)',
      ...appendExtraColor('#9f6aff')
    },
    error: {
      50: 'linear-gradient(45deg, #f5af86 40%, #fd9771 90%)',
      100: 'linear-gradient(45deg, #d22121 40%, #b14100 90%)',
      200: 'linear-gradient(45deg, #901616 40%, #7b2e01 90%)',
      ...appendExtraColor('#cf5a73')
    },
    success: {
      50: 'linear-gradient(45deg, #88f586 40%, #bafd71 90%)',
      100: 'linear-gradient(45deg, #35dc32 20%, #2af5cf 90%)',
      200: 'linear-gradient(45deg, #039400 20%, #0084a2 90%)',
      ...appendExtraColor('#16b513')
    },
    common: {
      white: '#fdfefe',
      black: rgb(blackColor)
    },
    grey: {
      50: rgb(blackColor.lighten(4.6)),
      100: rgb(blackColor.lighten(4.45)),
      200: rgb(blackColor.lighten(4.3)),
      300: rgb(blackColor.lighten(4.15)),
      400: rgb(blackColor.lighten(3.5)),
      500: rgb(blackColor.lighten(2)),
      600: rgb(blackColor.lighten(1.7)),
      700: rgb(blackColor.lighten(1.4)),
      800: rgb(blackColor.lighten(1.2)),
      900: rgb(blackColor.lighten(1.0))
    },
    background: {
      default: '#fafafa',
      paper: '#fdfefe'
    }
  },
  shape: {
    borderRadius: 8
  },
  shadows: [
    'none',
    '0px 6px 6px -3px rgba(0,0,0,0.04), 0px 10px 14px 1px rgba(0,0,0,0.04), 0px 4px 18px 3px rgba(0,0,0,0.04)',
    '0px 6px 6px -3px rgba(0,0,0,0.08), 0px 10px 14px 1px rgba(0,0,0,0.08), 0px 4px 18px 3px rgba(0,0,0,0.08)',
    '0px 6px 6px -3px rgba(0,0,0,0.12), 0px 10px 14px 1px rgba(0,0,0,0.12), 0px 4px 18px 3px rgba(0,0,0,0.12)',
    '0px 6px 6px -3px rgba(0,0,0,0.16), 0px 10px 14px 1px rgba(0,0,0,0.16), 0px 4px 18px 3px rgba(0,0,0,0.16)',
    '0px 6px 6px -3px rgba(0,0,0,0.20), 0px 10px 14px 1px rgba(0,0,0,0.20), 0px 4px 18px 3px rgba(0,0,0,0.20)',
    '0px 6px 6px -3px rgba(0,0,0,0.24), 0px 10px 14px 1px rgba(0,0,0,0.24), 0px 4px 18px 3px rgba(0,0,0,0.24)',
    '0px 6px 6px -3px rgba(0,0,0,0.28), 0px 10px 14px 1px rgba(0,0,0,0.28), 0px 4px 18px 3px rgba(0,0,0,0.28)',
    '0px 6px 6px -3px rgba(0,0,0,0.32), 0px 10px 14px 1px rgba(0,0,0,0.32), 0px 4px 18px 3px rgba(0,0,0,0.32)',
    '0px 6px 6px -3px rgba(0,0,0,0.36), 0px 10px 14px 1px rgba(0,0,0,0.36), 0px 4px 18px 3px rgba(0,0,0,0.36)',
    '0px 6px 6px -3px rgba(0,0,0,0.40), 0px 10px 14px 1px rgba(0,0,0,0.40), 0px 4px 18px 3px rgba(0,0,0,0.40)',
    '0px 6px 6px -3px rgba(0,0,0,0.44), 0px 10px 14px 1px rgba(0,0,0,0.44), 0px 4px 18px 3px rgba(0,0,0,0.44)',
    '0px 6px 6px -3px rgba(0,0,0,0.48), 0px 10px 14px 1px rgba(0,0,0,0.48), 0px 4px 18px 3px rgba(0,0,0,0.48)',
    '0px 6px 6px -3px rgba(0,0,0,0.52), 0px 10px 14px 1px rgba(0,0,0,0.52), 0px 4px 18px 3px rgba(0,0,0,0.52)',
    '0px 6px 6px -3px rgba(0,0,0,0.56), 0px 10px 14px 1px rgba(0,0,0,0.56), 0px 4px 18px 3px rgba(0,0,0,0.56)',
    '0px 6px 6px -3px rgba(0,0,0,0.60), 0px 10px 14px 1px rgba(0,0,0,0.60), 0px 4px 18px 3px rgba(0,0,0,0.60)',
    '0px 6px 6px -3px rgba(0,0,0,0.64), 0px 10px 14px 1px rgba(0,0,0,0.64), 0px 4px 18px 3px rgba(0,0,0,0.64)',
    '0px 6px 6px -3px rgba(0,0,0,0.68), 0px 10px 14px 1px rgba(0,0,0,0.68), 0px 4px 18px 3px rgba(0,0,0,0.68)',
    '0px 6px 6px -3px rgba(0,0,0,0.72), 0px 10px 14px 1px rgba(0,0,0,0.72), 0px 4px 18px 3px rgba(0,0,0,0.72)',
    '0px 6px 6px -3px rgba(0,0,0,0.76), 0px 10px 14px 1px rgba(0,0,0,0.76), 0px 4px 18px 3px rgba(0,0,0,0.76)',
    '0px 6px 6px -3px rgba(0,0,0,0.80), 0px 10px 14px 1px rgba(0,0,0,0.80), 0px 4px 18px 3px rgba(0,0,0,0.80)',
    '0px 6px 6px -3px rgba(0,0,0,0.84), 0px 10px 14px 1px rgba(0,0,0,0.84), 0px 4px 18px 3px rgba(0,0,0,0.84)',
    '0px 6px 6px -3px rgba(0,0,0,0.88), 0px 10px 14px 1px rgba(0,0,0,0.88), 0px 4px 18px 3px rgba(0,0,0,0.88)',
    '0px 6px 6px -3px rgba(0,0,0,0.92), 0px 10px 14px 1px rgba(0,0,0,0.92), 0px 4px 18px 3px rgba(0,0,0,0.92)',
    '0px 6px 6px -3px rgba(0,0,0,0.96), 0px 10px 14px 1px rgba(0,0,0,0.96), 0px 4px 18px 3px rgba(0,0,0,0.96)'
  ]
});

(function reduceShadowDepth(scale: number): void {
  const { shadows } = theme;
  const depthReg = /,\s*([0-1]\.[0-9]{1,2})\s*\)/g;
  for (let i = 0; i < shadows.length; i++) {
    let match;
    while ((match = depthReg.exec(shadows[i]))) {
      const scaled = (parseFloat(match[1] || '1') * scale).toFixed(2);
      shadows[i] = shadows[i].replace(match[0], `,${scaled})`);
    }
  }
})(0.15);

theme = {
  ...theme,
  overrides: {
    MuiTypography: {
      h4: {
        fontSize: '1.5rem',
        color: theme.palette.grey[800]
      },
      h5: {
        fontSize: '1.2rem',
        color: theme.palette.grey[700]
      },
      h6: {
        fontSize: '0.9rem',
        fontWeight: 'lighter',
        color: theme.palette.grey[500]
      }
    },
    MuiOutlinedInput: {
      root: {
        '& .MuiOutlinedInput-notchedOutline': {
          borderRadius: 0
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.secondary.main
        },
        '&.Mui-error .MuiOutlinedInput-notchedOutline': {
          borderColor: important(theme.palette.error.main)
        }
      },
      input: {
        height: '0.7rem'
      }
    },
    MuiInputLabel: {
      root: {
        '&.Mui-focused': {
          color: theme.palette.secondary.dark
        },
        '&.Mui-error': {
          color: important(theme.palette.error.dark)
        }
      }
    },
    MuiDrawer: {
      paper: {
        backgroundColor: theme.palette.common.white,
        boxShadow: theme.shadows[24]
      },
      paperAnchorDockedLeft: {
        borderRight: 0
      }
    },
    MuiButton: {
      root: {
        borderRadius: 0
      },
      label: {
        textTransform: 'none'
      },
      contained: {
        boxShadow: 'none',
        '&:active': {
          boxShadow: 'none'
        }
      }
    },
    MuiSnackbar: {
      root: {
        boxShadow: theme.shadows[0]
      }
    },
    MuiSnackbarContent: {
      root: {
        borderRadius: 0,

        boxShadow: theme.shadows[4]
      }
    },
    MuiAppBar: {
      colorPrimary: {
        backgroundColor: theme.palette.grey[50],
        color: theme.palette.grey[700]
      }
    },
    MuiTabs: {
      root: {
        marginLeft: theme.spacing(2)
      },
      indicator: {
        height: 3,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3
      }
    },
    MuiTab: {
      root: {
        textTransform: 'none',
        margin: '0 16px',
        minWidth: 0,
        lineHeight: '32px',
        padding: 0,
        [theme.breakpoints.up('md')]: {
          padding: 0,
          minWidth: 0
        }
      }
    },
    MuiIconButton: {
      root: {
        padding: theme.spacing(1)
      }
    },
    MuiDivider: {
      root: {
        backgroundColor: theme.palette.grey[400]
      }
    },
    MuiListItemText: {
      primary: {
        fontWeight: theme.typography.fontWeightMedium
      }
    },
    MuiListItemIcon: {
      root: {
        color: 'inherit',
        marginRight: 0,
        '& svg': {
          fontSize: 20
        }
      }
    },
    MuiAvatar: {
      root: {
        width: 32,
        height: 32
      }
    },
    MuiTooltip: {
      tooltip: {
        borderRadius: 0
      }
    },
    MuiFab: {
      primary: {
        background: theme.palette.primary[100]
      }
    }
  },
  props: {
    MuiTab: {
      disableRipple: true
    }
  },
  mixins: {
    ...theme.mixins,
    toolbar: {
      minHeight: 48
    }
  }
};

function important(v: any) {
  return `${v.toString()} !important`;
}

export default theme;
