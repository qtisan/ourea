import { IconButton, Snackbar, SnackbarContent, Theme } from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions/transition';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CloseIcon from '@material-ui/icons/Close';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import DefaultIcon from '@material-ui/icons/Message';
import WarningIcon from '@material-ui/icons/Warning';
import withStyles, { Styles } from '@material-ui/styles/withStyles';
import clsx, { ClassValue } from 'clsx';
import { Component, ComponentType, SyntheticEvent } from 'react';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
  default: DefaultIcon
};
const styles: Styles<Theme, {}> = (theme: Theme) => ({
  success: {
    backgroundColor: theme.palette.secondary.light
  },
  error: {
    backgroundColor: theme.palette.error.dark
  },
  info: {
    backgroundColor: theme.palette.secondary.main
  },
  warning: {
    backgroundColor: theme.palette.primary.dark
  },
  icon: {
    fontSize: 20
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1)
  },
  message: {
    display: 'flex',
    alignItems: 'center'
  }
});

export type SnackbarPosition =
  | 'top right'
  | 'top left'
  | 'bottom right'
  | 'bottom left'
  | 'top center'
  | 'bottom center';
export type SnackbarVariant = 'success' | 'warning' | 'error' | 'default' | 'info';
export interface SnackbarProps {
  open: boolean;
  classes: any;
  position?: SnackbarPosition;
  message?: string;
  duration?: number;
  onClose?: (event?: SyntheticEvent, reason?: string) => void;
  className?: ClassValue;
  variant?: SnackbarVariant;
  TransitionComponent?: ComponentType<TransitionProps>;
}

export default withStyles(styles)(
  class extends Component<SnackbarProps, {}> {
    render() {
      const {
        open,
        position = 'top right',
        duration = 5000,
        className = '',
        classes,
        variant = 'default',
        onClose = () => {},
        message = 'something catch your eyes!',
        TransitionComponent
      } = this.props;

      const ans = position.split(' ');
      const Icon = variantIcon[variant];
      return (
        <Snackbar
          anchorOrigin={{
            vertical: ans[0] as ('top' | 'bottom'),
            horizontal: ans[1] as ('left' | 'right' | 'center')
          }}
          open={open}
          autoHideDuration={duration}
          onClose={onClose}
          ContentProps={{ 'aria-describedby': 'top-level-message' }}
          {...(TransitionComponent ? { TransitionComponent } : {})}
        >
          <SnackbarContent
            className={clsx(classes[variant], className)}
            aria-describedby="client-snackbar"
            message={
              <span id="client-snackbar" className={classes.message}>
                <Icon className={clsx(classes.icon, classes.iconVariant)} />
                {message}
              </span>
            }
            action={[
              <IconButton key="close" aria-label="Close" color="inherit" onClick={onClose}>
                <CloseIcon className={classes.icon} />
              </IconButton>
            ]}
          />
        </Snackbar>
      );
    }
  }
);
