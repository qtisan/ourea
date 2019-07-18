import { IReactComponent } from 'mobx-react';
import { withRouter as nextWithRouter } from 'next/router';

export default function withRouter<C extends IReactComponent>(componentClass: C): C {
  const WithRouterComponent = nextWithRouter(componentClass);
  WithRouterComponent.displayName = `withRouter(${componentClass.displayName ||
    componentClass.name ||
    (componentClass.constructor && componentClass.constructor.name) ||
    'Component'})`;
  return WithRouterComponent as C;
}
