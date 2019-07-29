import { Instance, types } from 'mobx-state-tree';
import { SnackbarPosition, SnackbarVariant } from '../components/Snackbar';

export interface SnackbarDefaultProps {
  open: boolean;
  message: string;
  position: SnackbarPosition;
  duration: number;
  variant: SnackbarVariant;
}
export const snackbarDefaultProps: SnackbarDefaultProps = {
  open: false,
  message: 'no message',
  position: 'top center',
  duration: 5000,
  variant: 'default'
};

export const Snackbar = types
  .model({
    open: types.boolean,
    message: types.string,
    position: types.string,
    duration: types.number,
    variant: types.string
  })
  .actions((self) => ({
    close() {
      self.open = false;
    },
    show(
      message?: string,
      opts?: {
        position?: SnackbarPosition;
        duration?: number;
        variant?: SnackbarVariant;
      }
    ) {
      if (message) {
        self.message = message;
      }
      if (opts) {
        self.position = opts.position || snackbarDefaultProps.position;
        self.duration = opts.duration || snackbarDefaultProps.duration;
        self.variant = opts.variant || snackbarDefaultProps.variant;
      }
      self.open = true;
    }
  }))
  .extend((self) => ({
    actions: {
      success(message: string, opts?: { position?: SnackbarPosition; duration?: number }) {
        self.show(message, { variant: 'success', ...opts });
      },
      warn(message: string, opts?: { position?: SnackbarPosition; duration?: number }) {
        self.show(message, { variant: 'warning', ...opts });
      },
      error(message: string, opts?: { position?: SnackbarPosition; duration?: number }) {
        self.show(message, { variant: 'error', ...opts });
      },
      info(message: string, opts?: { position?: SnackbarPosition; duration?: number }) {
        self.show(message, { variant: 'info', ...opts });
      }
    }
  }));

export type ISnackbar = Instance<typeof Snackbar>;

export const initializeSnackbar = (defaultPrps?: SnackbarDefaultProps) =>
  Snackbar.create(defaultPrps || snackbarDefaultProps);
