'use strict';

import App from './containers/App.jsx';
import Updates from './containers/Updates.jsx';
import SampleIds from './containers/SampleIds.jsx';
import Facilities from './containers/Facilities.jsx';
import Riders from './containers/Riders.jsx';

/* equiavlent to the following JSX:
<Route path='/' component={App}>
  <IndexRoute component={Updates}/>
  <Route path='/sampleids' component={SampleIds}/>
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
      {path: '/sampleids', component: SampleIds},
      {path: '/facilities', component: Facilities},
      {path: '/riders', component: Riders}
    ]
  }
];
