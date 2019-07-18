import { NextContext } from 'next';
import { camelToHyphenate } from 'phusis';
import * as React from 'react';

interface IndexProps {
  userAgent: string;
}

export default class Index extends React.Component<IndexProps> {
  static async getInitialProps({ req }: NextContext) {
    const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
    return { userAgent };
  }
  render() {
    return (
      <div>
        <h4>Hello, {this.props.userAgent}</h4>
        <p>{camelToHyphenate('helloWorld')}</p>
        <p>{Date.getCurrentStamp().toString()}</p>
        <p>
          {Date.moment()
            .format('YYYY-MM-DD')
            .toString()}
        </p>
      </div>
    );
  }
}
