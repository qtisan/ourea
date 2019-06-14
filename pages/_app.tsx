import App, { Container, NextAppContext, DefaultAppIProps } from 'next/app';

class OureaApp extends App<DefaultAppIProps> {
  static async getInitialProps({ Component, ctx }: NextAppContext): Promise<DefaultAppIProps> {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <Component { ...pageProps } />
      </Container>
    );
  }
}

export default OureaApp;