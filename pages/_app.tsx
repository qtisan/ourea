import { Provider } from 'mobx-react';
import { getSnapshot } from 'mobx-state-tree';
import App, { AppProps, Container, DefaultAppIProps, NextAppContext } from 'next/app';
import { Exception } from 'phusis';
import { ErrorInfo } from 'react';
import { constructStore, initializeStore, IStore } from '../lib/stores';

interface IOwnProps {
  isServer: boolean;
  initialState: IStore;
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
      initialState: getSnapshot(store),
      isServer,
      pageProps
    };
  }
  private store: IStore;

  constructor(props: OureaAppProps) {
    super(props);
    // debugger;
    this.store = constructStore(typeof window === 'undefined', props.initialState as any) as IStore;
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
