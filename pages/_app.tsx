import { Provider } from 'mobx-react';
import { getSnapshot } from 'mobx-state-tree';
import App, { AppProps, Container, DefaultAppIProps, NextAppContext } from 'next/app';
import { Exception } from 'phusis';
import { ErrorInfo } from 'react';
import { initializeStore, IStore } from '../lib/stores';

interface IOwnProps {
  initialState: IStore;
  isServer: boolean;
}

type OureaAppProps = IOwnProps &
  DefaultAppIProps &
  AppProps<Record<string, string | string[] | undefined>, {}>;
class OureaApp extends App<OureaAppProps> {
  static async getInitialProps({ Component, ctx }: NextAppContext) {
    const isServer = typeof window === 'undefined';
    const store = await initializeStore(isServer);
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    await new Promise((resolve) => setTimeout(() => resolve(), 1000));
    return {
      initialState: store ? getSnapshot(store) : null,
      pageProps,
      isServer
    };
  }
  private store: IStore = null as any;

  constructor(props: OureaAppProps) {
    super(props);
    this.store = initializeStore(props.isServer, props.initialState);
  }

  componentDidCatch(error: Exception, info: ErrorInfo) {
    this.store.snackbar.error(error.message);
    console.error(info);
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <Provider store={this.store}>
          <Component {...pageProps} />
        </Provider>
      </Container>
    );
  }
}

export default OureaApp;
