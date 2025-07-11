import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import Menu from './components/Menu';
import Category from './components/Category';
import MediaDetails from './components/MediaDetails';
import SignIn from './auth/SignIn';
import login from './auth/login';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <Menu />
    <IonReactRouter>
      <IonRouterOutlet id="main-content">
        <Route exact path="/home" component={Home} />
        <Route exact path="/register" component={SignIn} />
        <Route exact path="/login" component={login} />
        <Route exact path="/category/:id/:name" component={Category} />
        <Route exact path="/:mediaType(movie|tv)/:id" component={MediaDetails} />
        <Route exact path="/">
          <Redirect to="/register" />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
