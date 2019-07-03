import App, { Container, NextAppContext, DefaultAppIProps, AppProps } from 'next/app';
import { initializeStore, IStore, constructStore } from '../lib/stores';
import { getSnapshot } from 'mobx-state-tree';
import { Provider } from 'mobx-react';

interface IOwnProps {
  isServer: boolean
  initialState: IStore
}

type OureaAppProps = IOwnProps & DefaultAppIProps
  & AppProps<Record<string, string | string[] | undefined>, {}>;
class OureaApp extends App<OureaAppProps> {
  private store: IStore

  static async getInitialProps({ Component, ctx }: NextAppContext) {
    const isServer = typeof window === 'undefined';
    const store = await initializeStore(isServer);
    let pageProps = {}
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    await new Promise(resolve => setTimeout(() => resolve(), 1000));
    return {
      initialState: getSnapshot(store),
      isServer,
      pageProps,
    }
  }

  constructor(props: OureaAppProps) {
    super(props);
    this.store = constructStore(typeof window === 'undefined', props.initialState as any) as IStore;
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