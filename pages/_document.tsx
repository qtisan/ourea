import Document, { Html, Head, Main, NextScript, NextDocumentContext, DefaultDocumentIProps } from 'next/document';
import { ServerStyleSheets } from '@material-ui/styles';
import React from 'react';

export default class OureaDocument extends Document<DefaultDocumentIProps> {
  static async getInitialProps(ctx: NextDocumentContext): Promise<DefaultDocumentIProps> {
    const sheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: App => props => sheets.collect(<App {...props} />),
      });
    const initialProps: DefaultDocumentIProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      styles: (
        <React.Fragment>
          {initialProps.styles}
          {sheets.getStyleElement()}
        </React.Fragment>
      ),
    };
  }

  render() {
    return (
      <Html>
        <Head>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
          />
          <style>
            {`
body { 
  margin: 0;
}
input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus, input:-webkit-autofill:active {
  -webkit-transition: color 99999s ease-out,background-color 99999s ease-out;
  -webkit-transition-delay: 99999s;
}

::-webkit-scrollbar {
  width: 4px; 
  height: 4px; 
}
::-webkit-scrollbar-track{
  background-color: #efefef;
  border-radius: 0;
}
 ::-webkit-scrollbar-thumb{
  border-radius: 0;
  background-color: #ddd;
}
::-webkit-scrollbar-corner {
  background:khaki;
}
            `}
          </style>
        </Head>
        <body className="ourea-body">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
