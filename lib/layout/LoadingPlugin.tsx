import LinearProgress from '@material-ui/core/LinearProgress';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { IStore, store as currentStore } from '../stores';

@inject('store')
@observer
class LoadingPlugin extends React.Component<{
  store?: IStore;
}> {
  render() {
    const { store = currentStore } = this.props;
    return (
      <div
        style={{
          flexGrow: 1,
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          zIndex: 9999,
          opacity: store.loading === 100 ? 0 : 100,
          transition: 'all 1s'
        }}
      >
        <LinearProgress color="secondary" variant="determinate" value={store.loading} />
      </div>
    );
  }
}

export default LoadingPlugin;
