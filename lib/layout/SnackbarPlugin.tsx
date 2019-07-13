import { Slide } from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions/transition';
import { inject, observer } from 'mobx-react';
import React from 'react';
import Snackbar, { SnackbarPosition, SnackbarVariant } from '../components/Snackbar';
import { IStore, store as currentStore } from '../stores';

@inject('store')
@observer
class SnackbarPlugin extends React.Component<{
  store?: IStore;
}> {
  render() {
    const { store = currentStore } = this.props;
    return (
      <Snackbar
        open={store.snackbar.open}
        position={store.snackbar.position as SnackbarPosition}
        duration={store.snackbar.duration}
        message={store.snackbar.message}
        variant={store.snackbar.variant as SnackbarVariant}
        onClose={() => store.snackbar.close()}
        TransitionComponent={(props: TransitionProps) => <Slide {...props} direction="left" />}
      />
    );
  }
}

export default SnackbarPlugin;
