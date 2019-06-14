import * as React from 'react';
import ErrorComponent, { DefaultErrorIProps } from 'next/error';
import { NextContext } from 'next';

export default class Error extends React.Component<DefaultErrorIProps> {
  static getInitialProps({ res, err }: NextContext): DefaultErrorIProps {
    const statusCode: number = res ? res.statusCode : 999;
    if (err) {
      console.error(`[${err.name}] - ${err.message}`);
      console.error(err.stack);
    }
    return { statusCode };
  }

  render() {
    return (
      <ErrorComponent statusCode={this.props.statusCode} />
    );
  }
}
