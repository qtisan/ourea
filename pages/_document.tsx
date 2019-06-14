import Document, { Html, Head, Main, NextScript, NextDocumentContext, DefaultDocumentIProps } from 'next/document';

export default class OureaDocument extends Document<DefaultDocumentIProps> {
  static async getInitialProps(ctx: NextDocumentContext): Promise<DefaultDocumentIProps> {
    const initialProps: DefaultDocumentIProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <style>
            {`
            body { 
              margin: 0; 
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
