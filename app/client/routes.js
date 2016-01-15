'use strict';

import App from './containers/App.jsx';
import Updates from './containers/Updates.jsx';
import Samples from './containers/Samples.jsx';
import Facilities from './containers/Facilities.jsx';
import Riders from './containers/Riders.jsx';

/* equiavlent to the following JSX:
<Route path='/' component={App}>
  <IndexRoute component={Updates}/>
  <Route path='/samples' component={Samples}/>
  <Route path='/facilities' component={Facilities}/>
  <Route path='/riders' component={Riders}/>
</Route>
 */

// Routes configuration
export default [
  {
    path: '/',
    component: App,
    indexRoute: {component: Updates},
    childRoutes: [
      {path: '/samples', component: Samples},
      {path: '/facilities', component: Facilities},
      {path: '/riders', component: Riders}
    ]
  }
];
