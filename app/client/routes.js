'use strict';

import App from './containers/App.jsx';
import Changes from './containers/Changes.jsx';
import Samples from './containers/Samples.jsx';
import Facilities from './containers/Facilities.jsx';
import Riders from './containers/Riders.jsx';

/* equiavlent to the following JSX:
<Route path='/' component={App}>
  <IndexRoute component={Changes}/>
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
    indexRoute: {component: Changes},
    childRoutes: [
      {path: '/samples', component: Samples},
      {path: '/facilities', component: Facilities},
      {path: '/riders', component: Riders}
    ]
  }
];
